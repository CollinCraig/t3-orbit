# StarkPC (Windows) render for the T3 Orbit film. Same rules as the box's other render jobs: BelowNormal priority, a game watcher (VALORANT or any game → kill the job tree within ~2 s;
# the Riot launcher alone is fine), and a shared-box CPU gate. Budget for this side project: 6 logical threads
# (affinity on the top 6), Remotion concurrency <= 6, NVENC for the final encodes, and the whole box kept <= 85 % CPU
# (the job tree is suspended while the box is above 85 % and resumed below 78 %).
#   powershell -File render-starkpc.ps1 [-Stills] [-NoSquare]
# Layout: C:\t3-orbit-film\repo = t3-orbit.json + film\ (synced from the MacBook); film\node_modules is a junction to
# an existing Remotion 4.0.539 install ($env:ORBIT_NODE_MODULES, default below). Exit 3 = stopped for a game.
param([switch]$Stills, [switch]$NoSquare, [switch]$KitOnly, [string]$StillFrames = '40,150,190,262,305,370,430,495,555,620,690,750,830')
$ErrorActionPreference = 'Stop'
$me = Get-Process -Id $PID
$me.PriorityClass = 'BelowNormal'
$threads = (Get-CimInstance Win32_Processor | Measure-Object NumberOfLogicalProcessors -Sum).Sum
$mask = 0; for ($i = $threads - 6; $i -lt $threads; $i++) { $mask = $mask -bor (1L -shl $i) }
$me.ProcessorAffinity = [IntPtr]$mask   # children inherit: 6 threads max
$film = 'C:\t3-orbit-film\repo\film'
$mods = if ($env:ORBIT_NODE_MODULES) { $env:ORBIT_NODE_MODULES } else { 'C:\fd-video\node_modules' }
Set-Location $film
New-Item -ItemType Directory -Force out | Out-Null
if (-not (Test-Path node_modules)) { cmd /c mklink /J node_modules $mods | Out-Null }
$ffmpeg = (Get-Command ffmpeg).Source
$browser = "$mods\.remotion\chrome-headless-shell\win64\chrome-headless-shell-win64\chrome-headless-shell.exe"
$remotion = 'node_modules\@remotion\cli\remotion-cli.js'

$games = 'VALORANT', 'VALORANT-Win64-Shipping', 'FortniteClient-Win64-Shipping', 'cs2', 'Minecraft', 'League of Legends',
  'RocketLeague', 'r5apex', 'Overwatch', 'GTA5', 'RainbowSix', 'eldenring', 'bg3', 'cod'
function Test-Game { [bool](Get-Process -Name $games -ErrorAction SilentlyContinue) -or [bool](tasklist /NH | findstr /i "VALORANT-Win64 VALORANT.exe") }
function Get-Cpu { (Get-Counter '\Processor(_Total)\% Processor Time' -SampleInterval 1 -MaxSamples 2).CounterSamples.CookedValue | Measure-Object -Average | ForEach-Object Average }
if (Test-Game) { Write-Output 'GAME RUNNING - not starting'; exit 3 }

Add-Type -TypeDefinition @'
using System; using System.Runtime.InteropServices;
public static class OrbitTree {
  [DllImport("kernel32.dll")] static extern IntPtr OpenProcess(uint a, bool i, int id);
  [DllImport("kernel32.dll")] static extern bool CloseHandle(IntPtr h);
  [DllImport("ntdll.dll")] static extern int NtSuspendProcess(IntPtr h);
  [DllImport("ntdll.dll")] static extern int NtResumeProcess(IntPtr h);
  public static void Set(int id, bool pause) { var h = OpenProcess(0x0800, false, id); if (h == IntPtr.Zero) return; try { if (pause) NtSuspendProcess(h); else NtResumeProcess(h); } finally { CloseHandle(h); } }
}
'@
function Get-Tree($root) {
  $all = Get-CimInstance Win32_Process; $tree = @($root)
  do { $more = @($all | Where-Object { $tree -contains $_.ParentProcessId -and $tree -notcontains $_.ProcessId } | ForEach-Object { [int]$_.ProcessId }); $tree += $more } while ($more.Count)
  $tree
}

# Wait for room on the shared box before each step (up to 20 min).
function Wait-Room {
  for ($k = 0; $k -lt 120; $k++) {
    if (Test-Game) { Write-Output 'GAME RUNNING - stopping'; exit 3 }
    $c = Get-Cpu
    if ($c -le 70) { return }
    Write-Output ("box at {0:N0}% CPU, waiting" -f $c); Start-Sleep 10
  }
  throw 'box stayed busy for 20 min'
}

function Step($name, $exe, [string[]]$argv) {
  Wait-Room
  $t0 = Get-Date
  Write-Output "== $name"
  $log = "out\$($name -replace '\W','_').log"
  $p = Start-Process -FilePath $exe -ArgumentList $argv -NoNewWindow -PassThru -RedirectStandardOutput $log -RedirectStandardError "$log.err"
  $null = $p.Handle   # so ExitCode is populated
  $p.PriorityClass = 'BelowNormal'
  $paused = $false; $nextCpu = Get-Date
  while (-not $p.HasExited) {
    if (Test-Game) {
      taskkill /PID $p.Id /T /F | Out-Null
      Set-Content out\GAME-STOP.txt (Get-Date -Format o)
      Write-Output "GAME STARTED - killed $name"; exit 3
    }
    if ((Get-Date) -ge $nextCpu) {
      $c = Get-Cpu; $nextCpu = (Get-Date).AddSeconds(6)
      if (-not $paused -and $c -gt 85) { foreach ($id in (Get-Tree $p.Id)) { [OrbitTree]::Set($id, $true) }; $paused = $true; Write-Output ("paused at {0:N0}% CPU" -f $c) }
      elseif ($paused -and $c -lt 78) { foreach ($id in (Get-Tree $p.Id | Sort-Object -Descending)) { [OrbitTree]::Set($id, $false) }; $paused = $false; Write-Output ("resumed at {0:N0}% CPU" -f $c) }
    }
    Start-Sleep -Milliseconds 1500
    $p.Refresh()
  }
  $p.WaitForExit()
  if ($p.ExitCode -ne 0) { Get-Content $log -Tail 30; Get-Content "$log.err" -Tail 30; throw "$name failed ($($p.ExitCode))" }
  Write-Output ("   {0} done in {1:N1}s" -f $name, ((Get-Date) - $t0).TotalSeconds)
}

$c = Get-Cpu
$conc = [int][math]::Max(2, [math]::Min(6, [math]::Floor((85 - $c) / 100 * $threads)))
Write-Output ("Box {0:N0}% CPU of {1} threads -> Remotion concurrency {2}, affinity 6 threads" -f $c, $threads, $conc)
$common = @('--gl=angle', "--browser-executable=$browser", "--concurrency=$conc", '--log=warn')
$start = Get-Date
# bundle once; every render/still reuses it
Step 'bundle' node @($remotion, 'bundle', 'src/index.ts', '--out-dir=out/bundle', '--log=warn')

if ($Stills) {
  foreach ($fr in ($StillFrames -split ',')) {
    Step "still-$fr" node (@($remotion, 'still', 'out/bundle', 'orbit-16x9', "out/stills/f$fr.jpg", "--frame=$fr", '--scale=0.5', '--image-format=jpeg') + $common)
  }
  if (-not $NoSquare) { foreach ($fr in 330, 560) { Step "still-sq-$fr" node (@($remotion, 'still', 'out/bundle', 'orbit-square', "out/stills/sq$fr.jpg", "--frame=$fr", '--scale=0.5', '--image-format=jpeg') + $common) } }
  exit 0
}

if (-not $KitOnly) {
# 1. score → loudnorm to -16 LUFS integrated, -1.5 dBTP (two-pass)
Step 'score' node @('audio/score.mjs', 'out/score.wav')
$ErrorActionPreference = 'Continue'   # ffmpeg logs to stderr
& $ffmpeg -hide_banner -nostats -i out/score.wav -af 'loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json' -f null - 2> out/loud1.txt
$j = (Get-Content out/loud1.txt -Raw); $j = [regex]::Match($j, '\{[^{}]*"input_i"[^{}]*\}').Value | ConvertFrom-Json
$ErrorActionPreference = 'Stop'
$ln = "loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=$($j.input_i):measured_TP=$($j.input_tp):measured_LRA=$($j.input_lra):measured_thresh=$($j.input_thresh):offset=$($j.target_offset):linear=true"
Step 'master' $ffmpeg @('-hide_banner', '-y', '-i', 'out/score.wav', '-af', $ln, '-ar', '48000', '-c:a', 'pcm_s24le', 'out/score-16.wav')

# 2. picture: near-lossless x264 intermediate from Remotion, then NVENC + AAC
$jobs = @(@{id = 'orbit-16x9'; out = 't3-orbit-film'}) + $(if ($NoSquare) { @() } else { @(@{id = 'orbit-square'; out = 't3-orbit-square'}) })
foreach ($jb in $jobs) {
  Step "render-$($jb.id)" node (@($remotion, 'render', 'out/bundle', $jb.id, "out/raw-$($jb.id).mp4", '--codec=h264', '--crf=12', '--x264-preset=veryfast', '--muted') + $common)
  Step "encode-$($jb.id)" $ffmpeg @('-hide_banner', '-y', '-i', "out/raw-$($jb.id).mp4", '-i', 'out/score-16.wav', '-map', '0:v', '-map', '1:a',
    '-c:v', 'h264_nvenc', '-preset', 'p7', '-tune', 'hq', '-multipass', 'fullres', '-rc', 'vbr', '-cq', '23', '-b:v', '0', '-maxrate', '9M', '-bufsize', '18M',
    '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-r', '30', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-shortest', '-movflags', '+faststart', "out/$($jb.out).mp4")
}
}
Step 'poster' node (@($remotion, 'still', 'out/bundle', 'orbit-16x9', 'out/poster.png', '--frame=305', '--image-format=png') + $common)

# 3. README launch kit: preview loops (Remotion → near-lossless mp4 → 2-pass palette GIF), the morph GIF cut from the
#    film's own frames, and the before/after still.
function Gif($src, $dst, $w, $extra) {
  $vf = "fps=15,scale=$($w):-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=160:stats_mode=diff[p];[b][p]paletteuse=dither=sierra2_4a:diff_mode=rectangle"
  Step "gif-$dst" $ffmpeg (@('-hide_banner', '-y') + $extra + @('-i', $src, '-filter_complex', $vf, '-loop', '0', "out/kit/$dst.gif"))
}
New-Item -ItemType Directory -Force out/kit | Out-Null
foreach ($id in 'preview-sidebar', 'preview-hover') {
  Step "render-$id" node (@($remotion, 'render', 'out/bundle', $id, "out/kit/$id.mp4", '--codec=h264', '--crf=10', '--x264-preset=veryfast', '--muted') + $common)
}
Gif 'out/kit/preview-sidebar.mp4' 'sidebar' 760 @()
Gif 'out/kit/preview-hover.mp4' 'orbit-hover' 720 @()
Gif 'out/raw-orbit-16x9.mp4' 'theme-morph' 800 @('-ss', '7.1', '-t', '3.2')
Step 'before-after' node (@($remotion, 'still', 'out/bundle', 'before-after', 'out/kit/before-after.png', '--image-format=png') + $common)
$ErrorActionPreference = 'Continue'
if (-not $KitOnly) {
& $ffmpeg -hide_banner -nostats -i out/t3-orbit-film.mp4 -map 0:a -af ebur128=peak=true -f null - 2>&1 | Select-String '^\s+(I|Peak):' | Select-Object -Last 2 | Out-File out/final-loudness.txt
Get-Content out/final-loudness.txt
}
Write-Output ("TOTAL {0:N1}s" -f ((Get-Date) - $start).TotalSeconds)
exit 0
