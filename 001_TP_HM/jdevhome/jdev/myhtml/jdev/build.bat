@echo off
  :: ------------------------------------------------------------------------------
  :: --         S t a r t : H o u s e   K e e p i n g   C o d e                  --
  :: ------------------------------------------------------------------------------
  @if not "%ECHO%"=="" echo %ECHO%
  setlocal & set RET=
  set SCRIPTNAME=%~n0
  set SCRIPTPATH=%~f0
  if /i "%TRACE%"=="on" (set TRACE=echo) else (set TRACE=rem)
  :: ------------------------------------------------------------------------------
  :: --         E n d : H o u s e   K e e p i n g   C o d e                      --
  :: ------------------------------------------------------------------------------

  :: ------------------------------------------------------------------------------
  :: --         S t a r t : S e t u p   G l o b a l  V a r i a b l e s           --
  :: ------------------------------------------------------------------------------
  set RELEASE=12.1.3
  set DASH=echo + + + + D O S + + + +

  :: ---- Packages to Zip Up: This is configurable by the user.
  set FWK_JBO_PKGS=oracle\jbo
  set FWK_PORTAL_PKGS=oracle\portal
  set FWK_PKGS=oracle\apps\fnd\server oracle\apps\fnd\framework oracle\apps\fnd\oalogviewer oracle\apps\fnd\common\server oracle\apps\fnd\preferences
  set SVC_PKGS=oracle\svc
  set SVC_TESTER_PKGS=oracle\apps\fnd\framework\svctester
  set REQ_PKGS=oracle\apps\ap oracle\apps\ar oracle\apps\gl oracle\apps\hr oracle\apps\po
  set LESSON_PKGS=oracle\apps\fnd\framework\toolbox
  :: ---- Packages to Zip Up: End

  :: This variable is not referenced directly in this batch file
  :: but it is required in order to run sourcesafe commands.
  if not defined SSUSER set SSUSER=guest
  if not defined T      set T=T:
  if not defined J      set J=J:
  if not defined D      set D=D:
  set D_NT=%D%\jdevbin\NT
  set D_EXT=%D%\jdevbin\ext
  set J_NT=%J%\NT

  set SS=%T%\users\fwk\ss\win32\ss

  set J_UNX=/nfs/group/jdevbin
  set UNX_BLD=%J_UNX%/NT/FWK/build
  set UNX_EXT=%J_UNX%/ext
  set UNX_T_FWK_BLD=/nfs/group/jdevhome/FWK/build
  set NT_BLD=%J_NT%\FWK\build
  set T_FWK_BLD=%T%\FWK\build
  set ERROR_LEVEL=0

  set XCOPY=xcopy/y
  set MOVE=move/y
  set JAR=%J_NT%\FWK\jdk1_5_0_03\bin\jar.exe
  set JAVADOC=%J_NT%\fwk\jdk1_5_0_03\bin\javadoc
  set UNX_EXT_FWK=%J_UNX%/ext/FWK
  set EXT=%J%\ext
  set EXT_FWK=%EXT%\FWK

  if not defined gotClassPath set gotClassPath=N

  :: ------------------------------------------------------------------------------
  :: --         E n d : S e t u p   G l o b a l  V a r i a b l e s               --
  :: ------------------------------------------------------------------------------

  :: ---- Execute Help
  if "%1" EQU "" (
    call :help
    goto :EOF
  )

  set doc=rem
  set docEOF=rem

  call :getDateTime
  set dateTime=%RET%

  :: ---- Perform the task requested by the user
  :: If the first character is a blank, remove the first char. This only happens on NT 4.0.
  :: Make adjustments for NT 4.0.
  set params=%*
  if "%params:~0,1%" EQU " " (
    set params=%params:~1%
    set XCOPY=xcopy
    set MOVE=move
  )
  call :%params%

  :: ---- Cleanup Code
  if /i "%1" EQU "getclasspath" (
    endlocal & set CLASSPATH=%CLASSPATH%& set gotClassPath=%gotClassPath%
  ) else if /i "%1" EQU "getstandardclasspath" (
    endlocal & set CLASSPATH=%CLASSPATH%& set gotClassPath=%gotClassPath%
  ) else (
    endlocal & set RET=%RET%& set BldDate=%dateTime%& set gotClassPath=%gotClassPath%
  )
goto :EOF

:: ------------------------------------------------------------------------------
:: --                         D O C U M E N T A T I O N                        --
:: ------------------------------------------------------------------------------
:help
if defined TRACE %TRACE% [%0 %*]
  set doc=echo
  set docEOF=goto :EOF

  if "%1" EQU "" (
    echo.                                                                                          > build_tmp_help_file
    echo BUILD.BAT performs functions to aid in building the OA Framework and                     >> build_tmp_help_file
    echo deploying Jdeveloper installations to the division. This batch file                      >> build_tmp_help_file
    echo supports the following build processes:                                                  >> build_tmp_help_file
    echo.                                                                                         >> build_tmp_help_file
    echo   * Joint APPS/TOOLS 8pm nightly build process. This includes installing                 >> build_tmp_help_file
    echo     the results of the nightly build onto the FWK J: drive private area.                 >> build_tmp_help_file
    echo.                                                                                         >> build_tmp_help_file
    echo   * Daily FWK 4pm build. This build is used as a sanity test build prior                 >> build_tmp_help_file
    echo     to the 8pm FWK/TOOLS nightly build process. The FWK 4pm build allows                 >> build_tmp_help_file
    echo     FWK to do a quick build to insure that the FWK/TOOLS 8pm build will                  >> build_tmp_help_file
    echo     have a high probability of success.                                                  >> build_tmp_help_file
    echo.                                                                                         >> build_tmp_help_file
    echo   * Install or Uninstalls a JDeveloper to the common development area                    >> build_tmp_help_file
    echo     ^(J: drive^) for the division.                                                       >> build_tmp_help_file
    echo.                                                                                         >> build_tmp_help_file
    echo The following is a list of the common routines which a user can call.                    >> build_tmp_help_file
    echo   ApplyLabel        Applies a label to SourceSafe and copies all known                   >> build_tmp_help_file
    echo                     dependency files which is required for the APPS/TOOLS                >> build_tmp_help_file
    echo                     build.                                                               >> build_tmp_help_file
    echo   DailyTest         Performs daily 4pm APPS build.                                       >> build_tmp_help_file
    echo   NightBird         Performs nightly 8pm APPS/TOOLS build.                               >> build_tmp_help_file
    echo   InstallJdev       Installs/Publishes a Jdev installation to the division.              >> build_tmp_help_file
    echo   UninstallJdev     Uninstalls/Removes a division Jdev installation.                     >> build_tmp_help_file
    echo.                                                                                         >> build_tmp_help_file
    echo The following is a list of routines which can be called to build specific                >> build_tmp_help_file
    echo zip files for the OA Framework:                                                          >> build_tmp_help_file
    echo   BldServerZips     Builds fwk*.zip, req*.zip, and lesson.zip.                           >> build_tmp_help_file
    echo   BldFwkDeploy      Builds fwk_deploy.zip                                                >> build_tmp_help_file
    echo   BldMyhtml         Builds Mythml.zip.                                                   >> build_tmp_help_file
    echo   BldReqDemo        Builds ReqDemo.zip.                                                  >> build_tmp_help_file
    echo   BldTutorial       Builds Tutorial.zip.                                                 >> build_tmp_help_file
    echo   BldBSOLabSolutions Builds BSOLabSolutions.zip.                                          >> build_tmp_help_file
    echo   BldBSOReferenceApp Builds BSOReferenceApp.zip.                                          >> build_tmp_help_file
    echo   BldFwkDoc         Builds oafjavadoc*.jar.                                              >> build_tmp_help_file
    echo   BldAll            Builds all of the above files. Builds dbg version only.              >> build_tmp_help_file
    echo.                                                                                         >> build_tmp_help_file
    echo [public] routines:                                                                       >> build_tmp_help_file
    findstr/B "::*************" %SCRIPTPATH% > build_tmp_routines_list
    sort/o build_tmp_routines_list build_tmp_routines_list
    for /f "tokens=2*" %%i in (build_tmp_routines_list) do if /i "%%i" EQU "[public]"  echo   %%j >> build_tmp_help_file
    echo.                                                                                         >> build_tmp_help_file

    echo [private] routines:                                                                      >> build_tmp_help_file
    for /f "tokens=2*" %%i in (build_tmp_routines_list) do if /i "%%i" EQU "[private]" echo   %%j >> build_tmp_help_file
    del/q build_tmp_routines_list
    echo.                                                                                         >> build_tmp_help_file
    echo To get help for a specific routine, enter build help ^<routine^>.                        >> build_tmp_help_file
    echo   Examples:  build help nightbird                                                        >> build_tmp_help_file
    echo              build help dailytest                                                        >> build_tmp_help_file
    echo              build help applylabel                                                       >> build_tmp_help_file
    echo.                                                                                         >> build_tmp_help_file
    echo To get help for all routines, enter build help all.                                      >> build_tmp_help_file
    echo   Example:   build help all                                                              >> build_tmp_help_file

    type build_tmp_help_file | more
    del/q build_tmp_help_file
  ) else (
    if /i "%1" EQU "all" (
      findstr/B "::*************" %SCRIPTPATH% > build_tmp_routines_list
      if exist build_tmp_help_file.bat  del/q build_tmp_help_file.bat
      for /f "tokens=3" %%i in (build_tmp_routines_list) do echo call %SCRIPTPATH% help %%i       >> build_tmp_help_file.bat
      call build_tmp_help_file.bat > build_tmp_routines_list
      type build_tmp_routines_list | more
      del/q build_tmp_routines_list
      del/q build_tmp_help_file.bat
    ) else (
      set API_NAME=%1
      call :%1
    )
  )

goto :EOF

:: ------------------------------------------------------------------------------
:: --                  B U I L D   R O U T I N E S                             --
:: ------------------------------------------------------------------------------
::************* [private] Test                 - Test if this works
:Test
  set loc=\\stnfs7\jdev_shiphomes\jdevadf
  set list=%loc%\main.jm8\nightly JDEVADF_MAIN.JM8_NT_ jdev11m8 1 %loc%\MAIN.JM9\nightly JDEVADF_MAIN.JM9_GENERIC_ jdev11m9 1 %loc%\main\nightly JDEVADF_MAIN_GENERIC_ jdev11 1 %loc%\MAIN.JI1\nightly JDEVADF_MAIN.JI1_GENERIC_ jdev11ji1 2 %loc%\MAIN.JI2\nightly JDEVADF_MAIN.JI2_GENERIC_ jdev11ji2 2
  set list_of_extensions=vcs-ade_bundle.zip junit-java_bundle.zip
  set tmp="%list%~%list_of_extensions%"
  call :test1 %tmp%
goto :EOF


::************* [public]  test1                - test1
:test1
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Extracts files from SS and compiles it
  call :docParameters
  %doc%   1 = SS Branch. (ie jdev, jdev57H, etc.)
  %doc%   2 = dbg or opt (dbg=build dbg zips or opt=build optimized zips)
  %doc%   3 = Location of Jdev installation (ie %NT_BLD%\jdev, %J_NT%\Jdev_57g_m36, etc.)
  %doc%   4 = SS label name. Use LATEST if you want to get the latest out from SS.
  %doc%   5 = Perform Javac on explicit file list (javac or nojavac)
  %doc%   ----- optional parameter(s) -----
  %doc%   6 = Output files in current directory (True). Default is False, which means that
  %doc%       the output files will go into a temp directory. At the end of this method
  %doc%       the temp directory will be deleted.
  call :docExample jdev dbg %NT_BLD%\jdev latest nojavac
  %docEOF%

  %DASH% Creating temporary work area ...
  call :blank WrkDir\myprojects\oracle WrkDir\dependencies

  pushd WrkDir\myprojects\oracle
    echo.
    echo get stuff from /scs/*
  popd

  pushd WrkDir\dependencies
    echo.
    echo populate dependencies
  popd

  pushd WrkDir
    echo.
    echo ----------------------------------------------------------------------
    echo Compiling FWK files ...
    echo ----------------------------------------------------------------------

    echo -----------------------------------------------------------------------
    call :getOpenDriveLetter
    set drvLtr=%RET%
    subst %drvLtr% %jdevIDE%

    set CLASSPATH=myclasses;%drvLtr%\jdk\jre\lib\rt.jar;%Apps%;%BiBeans%;%Uix%;%Jrad%;%Bc4j%;%Jdev%;%J2ee%;%Soap%;%OracleEl%;%Portal%
    echo CLASSPATH=%CLASSPATH%
    echo -----------------------------------------------------------------------

    set compileCmd=%jdevIDE%\jdev\bin\ojc -recurse -encoding Cp1252 %dbgFlag% -nowarn -d myclasses -classpath %CLASSPATH% -sourcepath myprojects myprojects\*.java
    echo %compileCmd%

    %compileCmd%  >..\error.log 2>&1

    if "%errorlevel%" EQU "1" (
      set ERROR_LEVEL=1
      echo Compilation error encountered in BldServerZips >> ..\error.log
      type ..\error.log
    ) else (
      del ..\error.log
    )

    subst/d %drvLtr%
  popd
  %DASH% Cleaning up temporary work area WrkDir ...
  rmdir/s/q WrkDir
goto :EOF

::************* [private] getFusionIdes        - Get Fusion IDEs
:getFusionIdes
  call :docHeader
  %doc% Get Fusion IDEs
  %doc%.
  call :docParameters none
  %docEOF%

  call :printBanner Start %0 [%*]

  set loc=\\stnfs7\jdev_shiphomes\jdevadf
  set list=%loc%\main\nightly JDEVADF_MAIN_GENERIC_ jdev11tip 8 %loc%\MAIN.D5PRIME\nightly  JDEVADF_MAIN.D5PRIME_GENERIC_ jdevdrop5prime 4
  call :processFusionIde %list%

  call :printBanner End %0
goto :EOF

::************* [private] processFusionIde     - Loop through parameters to get the fusion ides
:processFusionIde
  call :docHeader
  %doc% Loop through parameters to get the fusion ides
  %doc%.
  call :docParameters
  %doc%   CAUTION: Parameters for this routine are case sensitive
  %doc%   1 = stnfs7 location (Eg: \\stnfs7\jdev_shiphomes\jdevadf)
  %doc%   2 = Purgable directory name pattern (Eg: JDEVADF_MAIN.JM6)
  %doc%   3 = Linux symbolic link name (Eg: jdev11m6)
  %doc%   4 = Number of installations to keep (Eg: 2)
  %doc%   ----- optional parameter(s) -----
  %doc%   5 to N = These parameters are repeated in groups of 4s based on the same values as p1 through p4
  %doc%.
  call :docExample \\stnfs7\jdev_shiphomes\jdevadf\main\nightly JDEVADF_MAIN_GENERIC_ jdev11tip 2
  %docEOF%

  :processFusionIdeLoop
    if exist %1 call :installFusionIde %1 %2 %3 %4
    shift /1
    shift /1
    shift /1
    shift /1
    if "%4" NEQ "" goto :processFusionIdeLoop
goto :EOF


::************* [private] installFusionIde     - Installs a fusion IDE
:installFusionIde
  call :docHeader
  %doc% Installs a fusion IDE
  %doc%.
  call :docParameters
  %doc%   CAUTION: Parameters for this routine are case sensitive
  %doc%   1 = stnfs7 location (Eg: \\stnfs7\jdev_shiphomes\jdevadf)
  %doc%   2 = Purgable directory name pattern (Eg: JDEVADF_MAIN.JM6)
  %doc%   3 = Linux symbolic link name (Eg: jdev11m6)
  %doc%   4 = Number of installations to keep (Eg: 2)
  %doc%.
  call :docExample \\stnfs7\jdev_shiphomes\jdevadf\MAIN.JM9\nightly JDEVADF_MAIN.JM9_GENERIC_ jdev11m9 1
  %docEOF%

  call :printBanner Start %0 [%*]

  call :getoaextlabel %1\%2*
  set new_label=%ret%
  set directory_name_fragment=%2
  set stnfs7_dir=%1\%new_label%
  set symlink_directory=%3
  set totDirToKeep=%4

  :: By default initialize these variables to pick up DBG ide
  set destination_directory=%NT_BLD%\%new_label%
  set unix_destination_directory=%UNX_BLD%/%new_label%
  set jdevStudioZipDir=%stnfs7_dir%\debug

  call :unzipFusionIde %destination_directory%dbg %jdevStudioZipDir% %symlink_directory%dbg %directory_name_fragment% %totDirToKeep% %unix_destination_directory%dbg

  :: Only start pulling OPT ide for JI IDEs going forward.
  :: Find substring jdev11ji in symbolic link directory name.
  call :unzipFusionIde %destination_directory% %stnfs7_dir%\nondebug %symlink_directory% %directory_name_fragment% %totDirToKeep% %unix_destination_directory%

  call :printBanner End %0

goto :EOF

::************* [public]  unzipFusionIde       - Unzip the fusion ide into our dbg or ext area
:unzipFusionIde
  call :docHeader
  %doc% Unzip the fusion ide into our dbg or ext area
  %doc%.
  call :docParameters
  %doc%   CAUTION: Parameters for this routine are case sensitive
  %doc%   1 = Destination directory where new ide will be installed
  %doc%   2 = stnfs7 dir of jdevStudioZip
  %doc%   3 = Linux symbolic link name
  %doc%   4 = Purgable directory name pattern (Eg: JDEVADF_MAIN.JM6)
  %doc%   5 = Total directories to keep
  %doc%   6 = Unix destination directory where new ide will be installed
  %doc%.
  call :docExample j:\nt\fwk\build\JDEVADF_MAIN.JM9_GENERIC_061130.0700.4258 \\stnfs7\jdev_shiphomes\jdevadf\JDEVADF_MAIN.JM9_GENERIC_061130.0700.4258\debug jdev11m9 JDEVADF_MAIN.JM9 2 /jdevbin/NT/FWK/build/JDEVADF_MAIN.JM9_GENERIC_061130.0700.4258
  %docEOF%

  set destination_dir=%1
  set jdevStudioZipDir=%2
  set symlnk_dir=%3
  set directory_name_fragment=%4
  set jdevStudioZip=%jdevStudioZipDir%\jdevstudiobase1111.zip
  set list_of_extensions=vcs-ade_bundle.zip junit-java_bundle.zip BC4J_Junit_1013.zip
  set totDirToKeep=%5
  set unx_destination_dir=%6

  rem   echo %destination_dir%
  rem   echo %jdevStudioZipDir%
  rem   echo %symlnk_dir%
  rem   echo %directory_name_fragment%
  rem   echo %jdevStudioZip%
  rem   echo %list_of_extensions%
  rem   echo %totDirToKeep%
  rem   echo %unx_destination_dir%

  :: If the ide doesn't exist on the J: drive then continue
  ::  Copy zip file to private area
  echo.
  if exist %jdevStudioZip% (
    if not exist %destination_dir% (
      call :blank %destination_dir%
      xcopy/f %jdevStudioZip% %destination_dir%

      call :getExtensions %jdevStudioZipDir% %destination_dir% %list_of_extensions%

      call :linux %UNX_BLD%/build installFusionIde %unx_destination_dir% %directory_name_fragment% %symlnk_dir% %totDirToKeep% %list_of_extensions%

    ) else (
      echo Already have %destination_dir%
    )
  ) else (
    echo Can not find %jdevStudioZip%
  )

goto :EOF


::************* [public]  getExtensions        - Copy the extensions into the destination location
:getExtensions
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Copy the extensions into the destination location
  %doc%.
  call :docParameters
  %doc%   1 = stnfs7 dir of jdevStudioZip and extensions
  %doc%   2 = Destination directory
  %doc%   3 to N = List of extensions
  call :docExample \\stnfs7\jdev_shiphomes\jdevadf\JDEVADF_MAIN.JM9_GENERIC_061130.0700.4258\debug j:\nt\fwk\build\JDEVADF_MAIN.JM9_GENERIC_061130.0700.4258 vcs-ade_bundle.zip junit-java_bundle.zip
  %docEOF%

  call :printBanner Start %0 [%*]

  set jdevStudioZipDir=%1
  set destination_dir=%2

  shift /1
  shift /1
  :getExtensionsLoop
    set extension=%jdevStudioZipDir%\%1
    if exist %extension%    xcopy/f %extension% %destination_dir%
    shift /1
    if "%1" NEQ "" goto :getExtensionsLoop

goto :EOF

::************* [public]  CreateIde            - Create an Ide (DBG and OPT)
:CreateIde
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Create an Ide (DBG and OPT)
  %doc%.
  call :docParameters
  %doc%   1 = SS Branch (eg: jdev, jdev11510, etc)
  %doc%   2 = Build OPT or DBG first (eg: opt or dbg)
  %doc%   3 = ST Ship home directory (Eg: \\Stnfs7\jdev_shiphomes\oaext or \\Stnfs7\jdev_shiphomes\ojtrad_903)
  %doc%   4 = DBG zip file name (Eg: oaext1013_debug.zip)
  %doc%   5 = OPT zip file name (Eg: oaext1013_nondebug.zip)
  %doc%   6 = OVERLAY debug zip file name (Eg: oaext1013_dbgfwk.zip)
  call :docExample jdev dbg \\Stnfs7\jdev_shiphomes\oaext oaext1013_debug.zip oaext1013_nondebug.zip oaext1013_dbgfwk.zip
  %docEOF%

  call :printBanner Start %0 [%*]
  call :getDateTime
  set JOB_START=%RET%

  set SS_BRANCH=%1
  set DBG_OPT=%2
  set SHIP_HOMES=%3
  set DBG_ZIP=%4
  set OPT_ZIP=%5
  set OVERLAY_ZIP=%6

  ::=============================
  :: Locate IDE Zip
  ::-============================
  call :getOaExtLabel %SHIP_HOMES%
  if /i "%RET%" EQU "NO_BUILD" (
    call :printBanner ERROR ENCOUNTERED: Could not find any directories which contained an IDE
    goto :EOF
  )
  set OaExtLabel=%RET%

  set IDE_DBG_ZIP_LOC=%SHIP_HOMES%\%OaExtLabel%\%DBG_ZIP%
  if not exist %IDE_DBG_ZIP_LOC% (
    call :printBanner Could not find %IDE_DBG_ZIP_LOC%
    goto :EOF
  )

  set IDE_OPT_ZIP_LOC=%SHIP_HOMES%\%OaExtLabel%\%OPT_ZIP%
  if not exist %IDE_OPT_ZIP_LOC% (
    call :printBanner Could not find %IDE_OPT_ZIP_LOC%
    goto :EOF
  )

  set OVERLAY_ZIP_LOC=%SHIP_HOMES%\%OaExtLabel%\%OVERLAY_ZIP%
  if not exist %OVERLAY_ZIP_LOC% (
    call :printBanner Could not find %OVERLAY_ZIP_LOC%
    goto :EOF
  )

  ::=============================
  :: Create SS Label
  ::=============================
  :: JOB_START + OaExtLabel is too long for a SS label. Convert OaExtLabel (eg OAEXT_MAIN_NT_060617.0803.678 to 678)
  for /f "tokens=6 delims=_." %%i in ("%OaExtLabel%") do set abbrev_lbl=%%i

  set SS_LABEL=%JOB_START%_%abbrev_lbl%
  echo Applying label "%SS_LABEL%" to "%SS_BRANCH%" branch...

  call :ApplyLabel %SS_BRANCH% %SS_LABEL%

  ::=================================
  :: Build the IDEs (hybrid, opt, dbg)
  ::=================================
  ::=============================
  :: Create the Hybrid IDE
  ::=============================
  echo.
  call :BldHybridIdeZip %IDE_OPT_ZIP_LOC% %OVERLAY_ZIP_LOC%
  call :pwd
  set IDE_HYBRID_ZIP_LOC=%RET%\oaext_hybrid.zip
  call :BldAppsIde %SS_BRANCH% %SS_LABEL% dbg %IDE_HYBRID_ZIP_LOC% hybrid

  if /i "%DBG_OPT%" EQU "DBG" (
    call :BldAppsIde %SS_BRANCH% %SS_LABEL% dbg %IDE_DBG_ZIP_LOC% dbg
    call :BldAppsIde %SS_BRANCH% %SS_LABEL% opt %IDE_OPT_ZIP_LOC% opt
  ) else (
    call :BldAppsIde %SS_BRANCH% %SS_LABEL% opt %IDE_OPT_ZIP_LOC% opt
    call :BldAppsIde %SS_BRANCH% %SS_LABEL% dbg %IDE_DBG_ZIP_LOC% dbg
  )

  call :printBanner End %0
goto :EOF

::************* [public]  BldHybridIdeZip      - Build the "small" Hybrid IDE zip file
:BldHybridIdeZip
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Build the "small" Hybrid IDE zip file
  %doc%.
  call :docParameters
  %doc%   1 = OPT zip file name (Eg \\stnfs7\jdev_shiphomes\oaext\OAEXT_MAIN_NT_060616.0803.677\oaext1013_nondebug.zip)
  %doc%   2 = OVERLAY zip file name (Eg \\stnfs7\jdev_shiphomes\oaext\OAEXT_MAIN_NT_060616.0803.677\oaext1013_dbgfwk.zip)
  call :docExample \\stnfs7\jdev_shiphomes\oaext\OAEXT_MAIN_NT_060616.0803.677\oaext1013_nondebug.zip \\stnfs7\jdev_shiphomes\oaext\OAEXT_MAIN_NT_060616.0803.677\oaext1013_dbgfwk.zip
  %docEOF%

  call :printBanner Start %0 [%*]

  set IDE_OPT_ZIP_LOC=%1
  set OVERLAY_ZIP_LOC=%2
  for /f %%i in ("%IDE_OPT_ZIP_LOC%") do set OPT_ZIP=%%~nxi
  for /f %%i in ("%OVERLAY_ZIP_LOC%") do set OVERLAY_ZIP=%%~nxi

  call :blank BldHybridIdeZipTmp

  pushd BldHybridIdeZipTmp
    echo.
    xcopy/f %IDE_OPT_ZIP_LOC% .
    echo.
    xcopy/f %OVERLAY_ZIP_LOC% .
    echo.
    echo.
    echo   Unzipping %OPT_ZIP% ...
    %JAR% -xf %OPT_ZIP%
    del/f/q %OPT_ZIP%

    echo   Overlaying %OVERLAY_ZIP% onto optimized IDE ...
    %JAR% -xf %OVERLAY_ZIP%
    :: del/f/q %OVERLAY_ZIP%

    echo   Removing unecessary extensions ...
    call fwkbuild.bat fwkRmExtensions .

    echo   Creating new oaext_hybrid.zip ...
    %JAR% cfM ..\oaext_hybrid.zip .
  popd
  rmdir/s/q BldHybridIdeZipTmp
  echo.

  dir oaext_hybrid.zip
  echo.
  call :printBanner End %0
  echo.
goto :EOF

::************* [public]  BldAppsIde           - Build an APP Ide
:BldAppsIde
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Build an APP Ide
  %doc%.
  call :docParameters
  %doc%   1 = SS Branch (eg: jdev, jdev11510, etc)
  %doc%   2 = SS Label (eg: 2006_04_12_Wed_0505PM_611)
  %doc%   3 = Compile FWK Files with dbg or opt
  %doc%   4 = IDE zip file location (eg: \\Stnfs7\jdev_shiphomes\oaext\OAEXT_MAIN_NT_060412.0801.611\oaext1013_debug.zip)
  %doc%   5 = Sym Link Name (dbg, opt or hybrid)
  call :docExample jdev 2006_04_12_Wed_0505PM_611 d:\batchJobs\MorphIde\2006_04_12_Wed_0505PM_611_dbg_tmp J:\nt\fwk\build
  %docEOF%

  call :printBanner Start %0 [%*]

  set SS_BRANCH=%1
  set SS_LABEL=%2
  set DBG_OPT=%3
  set IDE_ZIP_LOC=%4
  set SYM_LNK_NAME=%5

:: Adding if condition to work on both Mark's-pc & rws70001ide
  hostname > temp.txt
  set /p HOST= < temp.txt
  del temp.txt
  if /i "%HOST%" EQU "rws70001ide"   set WRK_DIR=C:\BatchJobs\MorphIde\%SS_BRANCH%%SYM_LNK_NAME%_%SS_LABEL%
  if /i "%HOST%" EQU "mmnakamu-pc1"  set WRK_DIR=D:\BatchJobs\MorphIde\%SS_BRANCH%%SYM_LNK_NAME%_%SS_LABEL%
  :: set WRK_DIR=D:\BatchJobs\MorphIde\%SS_BRANCH%%SYM_LNK_NAME%_%SS_LABEL%
:: Modification Done

  if /i "%DBG_OPT%" EQU "DBG" (
    if /i "%SYM_LNK_NAME%" EQU "DBG"    set PRIVATE_AREA=%NT_BLD%\%SS_BRANCH%dbg_%SS_LABEL%
    if /i "%SYM_LNK_NAME%" EQU "HYBRID" set PRIVATE_AREA=%NT_BLD%\%SS_BRANCH%_%SS_LABEL%
  ) else (
    set PRIVATE_AREA=%EXT_FWK%\%SS_BRANCH%_%SS_LABEL%
  )

  set LOG_FILE=%WRK_DIR%\%SS_LABEL%_%SS_BRANCH%.log

  if not exist %IDE_ZIP_LOC% (
    call :printBanner Could not find %IDE_ZIP_LOC%
    goto :EOF
  )

  call :blank %WRK_DIR%
  pushd %WRK_DIR%
    %SS% cp $/%SS_BRANCH%      2>nul
    %SS% get -r -GWR build.bat 2>nul

    echo call build.bat MorphIde %SS_LABEL% %DBG_OPT% %IDE_ZIP_LOC% %SS_BRANCH% no_patch %SYM_LNK_NAME%
         call build.bat MorphIde %SS_LABEL% %DBG_OPT% %IDE_ZIP_LOC% %SS_BRANCH% no_patch %SYM_LNK_NAME% > %LOG_FILE% 2>&1
  popd

  if exist %PRIVATE_AREA% (
    echo on
    xcopy/y/f %LOG_FILE% %PRIVATE_AREA%
    rmdir/s/q %WRK_DIR%
    echo off
  ) else (
    echo PRIVATE AREA MISSING [%PRIVATE_AREA%]
    echo Review log file for problem [%LOG_FILE%]
  )

  call :printBanner End %0
goto :EOF

::************* [public]  getOaExtLabel        - Get OA Extension Label from hard drive directory names. Returns NO_BUILD if nothing found.
:getOaExtLabel
  call :docHeader
  %doc% Get OA Extension Label from hard drive directory names. Returns NO_BUILD if nothing found.
  %doc%.
  call :docParameters
  %doc%   1 to N = List of directories to search. They should be in order of priority. First directory found will be honored.
  call :docExample D:\OAExt_builds \\Stnfs7\jdev_shiphomes\oaext
  %docEOF%

  set RET=
  :getOaExtLabelLoop
    rem if exist %1 for /f %%d in ('dir/b/o:d %1') do set RET=%%d
    if exist %1 for /f %%d in ('dir/b/o:n %1') do set RET=%%d
    if "%RET%" NEQ "" goto :EOF
    shift /1
    if "%1" NEQ "" goto :getOaExtLabelLoop

  set RET=NO_BUILD
goto :EOF

::************* [private] genAppsVersionNum    - Given a private area directory name, return an incremented apps version #.
:genAppsVersionNum
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Given a private area directory name, return an incremented apps version # or "INVALID".
  %doc%.
  call :docParameters
  %doc%   1 = Private Area Directory Name (eg: jdev1013_2006_04_22_Sat_1100AM_622, jdev11510rup4_903813_1533_4, etc.)
  call :docExample jdev11510rup4_903813_1533_4
  %doc%.
  %doc% Example of P1 Values                  Expected return val for RET
  %doc% ------------------------------------  ------------------------------------
  %doc% jdev1013_2006_04_22_Sat_1100AM_622    jdev1013_2006_04_22_Sat_1100AM_622_1
  %doc% jdev11510_903813_1533                 jdev11510_903813_1533_1
  %doc% jdev11510rup4_903813_1533_4           jdev11510rup4_903813_1533_5
  %doc% jdev12x51013_90391_1583_1             jdev12x51013_90391_1583_2
  %doc% jdev12x5_90391_1583_1                 jdev12x5_90391_1583_2
  %doc% jdev1013                              "INVALID"
  %docEOF%

  set params=%1
  set params=%params:_= %
  call :genAppsVersionNum2 %params%

  :: If last number > 50 then append _1 to last number. Otherwise increment last number.
  set lastNumberIsNumeric=true
  echo %LAST_NUMBER%|findstr "[^0-9]" >nul
  if not errorlevel 1 (set lastNumberIsNumeric=false)

  if /i "%lastNumberIsNumeric%" EQU "false" (
    set RET="INVALID"
    goto :EOF
  )

  :: IMPLIED: At this point LAST_NUMBER contains a numeric value.
  set RET=%BASE_NUMBER%_%LAST_NUMBER%_1
  set tmp=%LAST_NUMBER%
  set/a tmp+=1
  if %LAST_NUMBER% LSS 50 set RET=%BASE_NUMBER%_%tmp%
goto :EOF

::************* [private] genAppsVersionNum2   - Must be used in conjunction w/ genAppVersionNum
:genAppsVersionNum2
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Must be used in conjunction w/ genAppVersionNum
  %doc%.
  call :docParameters
  %doc%   1 = Private Area Directory Name (eg: jdev1013_2006_04_22_Sat_1100AM_622, jdev11510rup4_903813_1533_4, etc.)
  call :docExample jdev11510rup4_903813_1533_4
  %doc%.
  %doc% Example of P1 Values                  Expected return val for BASE_NUMBER   Expected return val for LAST_NUMBER
  %doc% ------------------------------------  -----------------------------------   -----------------------------------
  %doc% jdev1013_2006_04_22_Sat_1100AM_622    jdev1013_2006_04_22_Sat_1100AM        622
  %doc% jdev1013_2006_04_23_Sun_1100AM_622    jdev1013_2006_04_23_Sun_1100AM        622
  %doc% jdev11510_903813_1533                 jdev11510_903813                      1533
  %doc% jdev11510_903813_1536                 jdev11510_903813                      1536
  %doc% jdev11510rup4_903813_1533_4           jdev11510rup4_903813_1533             4
  %doc% jdev12x51013_90391_1583_1             jdev12x51013_90391_1583               1
  %doc% jdev12x5_90391_1583_1                 jdev12x5_90391_1583                   1
  %doc% jdev510_903810_1080                   jdev510_903810                        1080
  %doc% jdev57h_90367_1092                    jdev57h_90367                         1092
  %doc% jdev_2006_04_22_Sat_0700PM_1583       jdev_2006_04_22_Sat_0700PM            1583
  %doc% jdev_2006_04_23_Sun_0700PM_1583       jdev_2006_04_23_Sun_0700PM            1583
  %docEOF%

  set BASE_NUMBER=
  set firstTime=true
  :genAppsVersionNum2Loop
    set LAST_NUMBER=%1
    if "%2" NEQ "" (
      if "%firstTime%" EQU "true" (
        set BASE_NUMBER=%1
      ) else (
        set BASE_NUMBER=%BASE_NUMBER%_%1
      )
      set firstTime=false
    )

    shift /1
    if /i "%1" NEQ "" goto :genAppsVersionNum2Loop
goto :EOF

::************* [public]  OAFCodeFreeze        - Executes an OAF Freeze
:OAFCodeFreeze
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Executes an OAF Freeze
  %doc%.
  call :docParameters
  %doc%   1 = Old SS Branch (Eg jdev, jdevcu2, etc)
  %doc%   2 = SS Label (Eg 2006_08_01_Tue_0600PM_725)
  %doc%   3 = New SS Branch (Eg jdev, jdevcu2, etc)
  call :docExample jdev 2006_08_01_Tue_0600PM_725 jdev12x11
  %docEOF%

  call :printBanner Start %0 [%*]

  set OLD_BRANCH=%1
  set LABEL=%2
  set NEW_BRANCH=%3

  call :BranchSS %OLD_BRANCH% %LABEL% %NEW_BRANCH%
  call :unix %UNX_BLD%/build clonePrivateArea install %LABEL% %NEW_BRANCH% %OLD_BRANCH%

  call :printBanner End %0
goto :EOF

::************* [public]  BranchSS             - Given an existing SS branch and label create a new branch based on that label
:BranchSS
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Given an existing SS branch and label create a new branch based on that label.
  %doc%.
  call :docParameters
  %doc%   1 = Old SS Branch (Eg jdev, jdev12x11, etc)
  %doc%   2 = SS Label (Eg 2006_08_01_Tue_0600PM_725)
  %doc%   3 = New SS Branch (Eg jdev, jdev12x11, etc)
  call :docExample jdev 2006_08_01_Tue_0600PM_725 jdev12x11
  %docEOF%

  call :printBanner Start %0 [%*]

  %SS% CP $/ 2>nul
  %SS% share $/%1 "-VL%2" -R -P%3 -E -I-Y -C"Created $/%3 based on %2 from $/%1"  2>nul
  call :ApplyLabel %3 %2

  call :printBanner End %0
goto :EOF

::************* [public]  IncrementLatestSsLbl - Gets the latest SS Label and increments it
:IncrementLatestSsLbl
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Gets the latest SS Label and increments it
  %doc%.
  call :docParameters
  %doc%   1 = SS Branch. (ie jdev, jdev57H, etc.)
  call :docExample jdevdrop4
  %docEOF%

  call :GetLatestSsLabel %1
  call :IncrementSsLabel %RET%
goto :EOF

::************* [public]  IncrementSsLabel     - Increments a standard SS Label
:IncrementSsLabel
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Increments a standard SS Label
  %doc%.
  call :docParameters
  %doc%   1 = Standard SS Label. (Example: 90391_1390, 90391_1390_1, 2006_08_01_Tue_0600PM_725, 2006_08_01_Tue_0600PM_725_1, etc)
  call :docExample 90391_1390
  %doc% Returns 90391_1390_1
  %doc%.
  call :docExample 90391_1390_3
  %doc% Returns 90391_1390_4
  %doc%.
  call :docExample 2006_08_01_Tue_0600PM_725
  %doc% Returns 2006_08_01_Tue_0600PM_725_1
  %doc%.
  call :docExample 2006_08_01_Tue_0600PM_725_1
  %doc% Returns 2006_08_01_Tue_0600PM_725_2
  %docEOF%

  :: Get the ST portion of the label
  call :ParseSSLabel %1 st
  set st=%RET%

  :: Get the APPS portion of the label
  call :ParseSSLabel %1 apps
  set apps=%RET%
  :: Increment the APPS portion of the label
  set/a apps+=1

  set RET=%st%_%apps%
goto :EOF

::************* [private] GetIdeVersion        - Given a Jdev IDE location, determines if IDE is a 1013 or 903 IDE. Returns 1013 or 903
:GetIdeVersion
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Given a Jdev IDE location, determines if IDE is a 1013 or 903 IDE. Returns 1013 or 903
  %doc%.
  call :docParameters
  %doc%   1 = Location of Jdev installation (ie %NT_BLD%\jdev, %J_NT%\Jdev_57g_m36, etc.)
  call :docExample %NT_BLD%\jdev11510
  %doc% Returns 903
  %doc%.
  call :docExample %NT_BLD%\jdev1013
  %doc% Returns 1013
  %docEOF%

  set IdeVersion=unknown
  if exist %1\adfc    set IdeVersion=1013
  if exist %1\forms90 set IdeVersion=903

  if /i "%IdeVersion%" EQU "unknown" (
    call :printBanner WARNING UNKNOWN IDE DETECTED IN %0 [%*]
    call :printBanner PLEASE LOOK INTO THIS!
  )

  set RET=%IdeVersion%
goto :EOF

::************* [public]  GetLatestSsLabel     - Gets the latest SS Label
:GetLatestSsLabel
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Gets the latest SS Label
  %doc%.
  call :docParameters
  %doc%   1 = SS Branch. (ie jdev, jdev57H, etc.)
  call :docExample jdevdrop4
  %docEOF%

  set ss_history=ss_history.tmp
  %SS% history $/%1 -L -F- -#1 > %ss_history% 2>nul
  for /f "tokens=1,2" %%i in (%ss_history%) do if /i "%%i" EQU "Label:" set SSLabel=%%j
  del %ss_history%
  set RET=%SSLabel:"=%
goto :EOF

::************* [private] ParseSSLabel         - Parses a standard SS label into st or apps version numbers
:ParseSSLabel
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Parses a standard SS label into and st or apps version numbers
  %doc%.
  call :docParameters
  %doc%   1 = Standard SS Label. (Example: 90391_1390, 90391_1390_1, 2006_08_01_Tue_0600PM_725, 2006_08_01_Tue_0600PM_725_1, etc)
  %doc%   2 = Piece that you want back. (valid values: st or apps)
  %doc%         Example: 90391_1390_3
  %doc%                  st       = 90391_1390
  %doc%                  apps     = 3
  %doc%.
  %doc%         Example: 2006_08_01_Tue_0600PM_725_1
  %doc%                  st       = 2006_08_01_Tue_0600PM_725
  %doc%                  apps     = 1
  call :docExample 2006_08_01_Tue_0600PM_725_1 st
  %docEOF%

  :: Determine which type of label you have:
  :: old fashion 11.5.10 label (90391_1390 or 90391_1390_1) contains 2 or 3 tokens
  ::  OR
  :: new R12 label (2006_08_11_Fri_0115PM_737 or 2006_08_11_Fri_0115PM_737_1) contains 6 or 7 tokens
  ::
  :: ASSUMPTION: If you have 5 or more tokens you can be assured that you have the new R12 style labels, otherwise old 11.5.10 style.
  set fifth_token=
  for /f "tokens=5* delims=_" %%i in ("%1") do set fifth_token=%%i
  set labelStyle=new
  if "%fifth_token%" EQU "" set labelStyle=old

  set RET=
  if /i "%labelStyle%" EQU "old" (
    if /i "%2" EQU "st"       for /f "tokens=1,2,3 delims=_" %%i in ("%1") do set RET=%%i_%%j
    if /i "%2" EQU "apps"     for /f "tokens=1,2,3 delims=_" %%i in ("%1") do set RET=%%k
  ) else (
    if /i "%2" EQU "st"       for /f "tokens=1,2,3,4,5,6 delims=_"  %%i in ("%1") do set RET=%%i_%%j_%%k_%%l_%%m_%%n
    if /i "%2" EQU "apps"     for /f "tokens=6* delims=_"           %%i in ("%1") do set RET=%%j
  )
goto :EOF

::************* [private] PrintBanner          - Convenience routine to print time stamp and starting banners
:PrintBanner
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Convenience routine to print time stamp and starting banners
  %doc%.
  call :docParameters
  %doc%   1 to N = Free form of parameters
  %docEOF%

  call :getDateTime
  set tmpDateTime=%RET%
  call :pwd
  set pwd=%RET%
  %DASH% ^<%tmpDateTime% [%pwd%] %*^>
goto :EOF

::************* [public]  Pwd                  - Returns a variable RET with the current directory
:Pwd
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Returns a variable RET with the current directory
  %doc%.
  call :docParameters none
  %docEOF%

  for /f %%i in ('cd') do @set ret=%%i
goto :EOF


::************* [private] DelPersonalizationsDaily - Deletes ToolBox Personalizations from databases.
:DelPersonalizationsDaily
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Deletes ToolBox Personalizations from databases.
  %doc%.
  call :docParameters none
  call :docExample
  %docEOF%

  call :printBanner Start %0 [%*]

  call :DelPersonalizations J:\NT\FWK\build\jdev      apps r12b1apps  fwk12dev  ap664sdb.us.oracle.com 4120 tutorial/webui/HelloWorldPG tutorial/webui/PoSearchPG tutorial/webui/PoDetailsPG tutorial/webui/PurchaseOrderPG tutorial/webui/SupplierSearchPG tutorial/webui/SupplierPG tutorial/webui/PoDescPG tutorial/webui/PoReviewPG tutorial/webui/HomePG tutorial/webui/PoLinesPG tutorial/webui/PoSummaryCreatePG tutorial/webui/PoSummaryDeletePG tutorial/webui/PoSummaryUpdatePG tutorial/webui/PoSummaryRN labsolutions/webui/HomePG labsolutions/webui/EmployeePG labsolutions/webui/EmpSearchPG labsolutions/webui/HelloWorldPG labsolutions/webui/EmpDetailsPG labsolutions/webui/EmpReviewPG labsolutions/webui/EmpDescPG labsolutions/webui/EmpAssignPG
  call :DelPersonalizations J:\NT\FWK\build\jdev11510 apps fwk11iapps fwk11i    ap607sdb.us.oracle.com 4103 tutorial/webui/HelloWorldPG tutorial/webui/PoSearchPG tutorial/webui/PoDetailsPG tutorial/webui/PurchaseOrderPG tutorial/webui/SupplierSearchPG tutorial/webui/SupplierPG tutorial/webui/PoDescPG tutorial/webui/PoReviewPG tutorial/webui/HomePG tutorial/webui/PoLinesPG tutorial/webui/PoSummaryCreatePG tutorial/webui/PoSummaryDeletePG tutorial/webui/PoSummaryUpdatePG tutorial/webui/PoSummaryRN labsolutions/webui/HomePG labsolutions/webui/EmployeePG labsolutions/webui/EmpSearchPG labsolutions/webui/HelloWorldPG labsolutions/webui/EmpDetailsPG labsolutions/webui/EmpReviewPG labsolutions/webui/EmpDescPG labsolutions/webui/EmpAssignPG

  call :printBanner End %0
goto :EOF

::************* [private] DelPersonalizations  - Deletes ToolBox Personalizations from a database.
:DelPersonalizations
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Deletes ToolBox Personalizations from a database.
  %doc%.
  call :docParameters
  %doc%   1 = Location of Jdev installation (ie %NT_BLD%\jdev, %J_NT%\Jdev_57g_m36, etc.)
  %doc%   2 = Database Username             (ie apps)
  %doc%   3 = Database Password             (ie apps)
  %doc%   4 = Database SID                  (ie dev115)
  %doc%   5 = Database Host                 (ie ap618dbs.us.oracle.com)
  %doc%   6 = Database Port                 (ie 1521)
  %doc%   7 to N = List of regions to delete.
  %doc%            Short Hand: Assumes these regions will come from /oracle/apps/fnd/framework/toolbox/
  %doc%            Example: tutorial/webui/HelloWorldPG tutorial/webui/PoSearchPG
  call :docExample %NT_BLD%\jdev apps apps dev115 ap618dbs.us.oracle.com 1521 tutorial/webui/HelloWorldPG tutorial/webui/PoSearchPG
  %docEOF%

  call :printBanner Start %0 [%*]

  :: This is the syntax for calling the delete command file:
  ::   delete /oracle/apps/fnd/framework/toolbox/tutorial/webui/HelloWorldPG -base -allcusts -username apps -password apps -sid dev115 -host ap618dbs.us.oracle.com -port 1521
  :DelPersonalizationsLoop
    %DASH% Deleting /oracle/apps/fnd/framework/toolbox/%7 from %4 ...
    call %1\jdev\bin\delete /oracle/apps/fnd/framework/toolbox/%7 -base -allcusts -username %2 -password %3 -sid %4 -host %5 -port %6
    shift /7
    if /i "%7" NEQ "" goto :DelPersonalizationsLoop

  call :printBanner End %0
goto :EOF

::************* [private] PatchStCandidateRel  - Applies a new label and patches OPT and DBG ST Candidate Release IDEs
:PatchStCandidateRel
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Applies a new label and patches OPT and DBG ST Candidate Release IDEs
  %doc%.
  call :docParameters
  %doc%   1 = SS Branch (Eg jdev, jdevcu2, etc)
  %doc%   2 = Patch OPT or DBG IDE first. Valid values are "OPT" or "DBG".
  %doc%   3 = Explicit Location of "small" DBG Jdev IDE Zip file. (Eg J:\NT\FWK\build\jdev12x15dbg_2006_10_09_Mon_1154PM_798_2\oaext1013_debug.zip)
  %doc%   4 = Explicit Location of "small" OPT Jdev IDE Zip file. (Eg J:\ext\FWK\jdev12x15_2006_10_09_Mon_1154PM_798_2\oaext1013_nondebug.zip)
  %doc%   5 = Explicit Location of "small" HYBRID Jdev IDE Zip file. (Eg J:\NT\FWK\build\jdev12x15_2006_10_09_Mon_1154PM_798_2\oaext_hybrid.zip)
  call :docExample jdev OPT J:\NT\FWK\build\jdev12x15dbg_2006_10_09_Mon_1154PM_798_2\oaext1013_debug.zip J:\ext\FWK\jdev12x15_2006_10_09_Mon_1154PM_798_2\oaext1013_nondebug.zip J:\NT\FWK\build\jdev12x15_2006_10_09_Mon_1154PM_798_2\oaext_hybrid.zip
  %docEOF%

  set SS_BRANCH=%1
  set ORDER=%2
  set DBG_IDE_ZIP=%3
  set OPT_IDE_ZIP=%4
  set HYBRID_IDE_ZIP=%5

  :: Patch the appropriate IDE first. THIS WILL AUTOMATICALLY CREATE A NEW LABEL FOR YOU.
  call :PatchIde dbg %HYBRID_IDE_ZIP% %SS_BRANCH% hybrid

  :: Get the latest SS label
  call :GetLatestSsLabel %SS_BRANCH%
  set SsLabel=%RET%

  if /i "%ORDER%" EQU "OPT" (
    call :PatchIde opt %OPT_IDE_ZIP% %SS_BRANCH% opt %SsLabel%
    call :PatchIde dbg %DBG_IDE_ZIP% %SS_BRANCH% dbg %SsLabel%
  ) else (
    call :PatchIde dbg %DBG_IDE_ZIP% %SS_BRANCH% dbg %SsLabel%
    call :PatchIde opt %OPT_IDE_ZIP% %SS_BRANCH% opt %SsLabel%
  )
goto :EOF

::************* [private] PatchIde             - Patches an existing IDE with the APPS components in SS
:PatchIde
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Patches an existing IDE with the APPS components in SS
  %doc%.
  call :docParameters
  %doc%   1 = opt or dbg flag (Eg opt or dbg)
  %doc%   2 = Explicit Location of "small" Jdev IDE Zip file. (Eg J:\NT\FWK\build\jdev_dbg_903812_1290\jdev903_dbg.zip)
  %doc%   3 = SS Branch (Eg jdev, jdevcu2, etc)
  %doc%   4 = Type of build (Eg dbg, opt, hybrid)
  %doc%   ----- optional parameter(s) -----
  %doc%   5 = SS label name. If omitted, a new incremented label will automatically be applied.
  call :docExample dbg J:\NT\FWK\build\jdev_dbg_903812_1290\jdev903_dbg.zip jdev hybrid
  %docEOF%

  set SsLabel=%5

  :: DOS deficiency ... you can't do a variable assignment which references another
  :: variable. In a DOS IF statement, ALL variables are evaluated at the start of the
  :: IF statement.
  if "%5" EQU "" call :IncrementLatestSsLbl %3
  if "%5" EQU "" set SsLabel=%ret%
  if "%5" EQU "" call :ApplyLabel %3 %SsLabel%
  call :MorphIde %SsLabel% %1 %2 %3 patch %4

goto :EOF

::************* [private] MorphIde             - Morphs a stock jdev ide into an APPS specific IDE.
:MorphIde
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Morphs a stock jdev ide into an APPS specific IDE.
  %doc%.
  call :docParameters
  %doc%   1 = SS label name. Default is LATEST
  %doc%   2 = opt or dbg flag (Eg opt or dbg)
  %doc%   3 = Explicit Location of "small" Jdev IDE Zip file. (Eg J:\NT\FWK\build\jdev_dbg_903812_1290\jdev903_dbg.zip)
  %doc%   4 = SS Branch (Eg jdev, jdevcu2, etc)
  %doc%   5 = Patch Ide with ONLY APPS pieces. You must specifiy "patch" to use this feature. Any other value will be ignored.
  %doc%   6 = Type of build (Eg opt, dbg, hybrid)
  call :docExample 903812_1290 dbg J:\NT\FWK\build\jdev_dbg_903812_1290\jdev903_dbg.zip jdev patch hybrid
  %docEOF%

  set SymLnkName=%4
  if /i "%6" EQU "DBG"  set SymLnkName=%4dbg

  if /i "%5" EQU "" call :printBanner ABORTING %0 [%*]. You must call this API with 5 parameters.
  if /i "%5" EQU "" goto :EOF

  call :printBanner Start %0 [%*]

  net stop "Symantec AntiVirus Client"       >nul 2>&1

  set pathToSmallIdeZipFile=%~d3%~p3
:: Adding if condition to work on both Mark's-pc & rws70001ide
  hostname > temp.txt
  set /p HOST= < temp.txt
  del temp.txt
  if /i "%HOST%" EQU "rws70001ide"     set wrkDir=c:\BatchJobs\MorphIde\%SymLnkName%_%1_%2
  if /i "%HOST%" EQU "mmnakamu-pc1"    set wrkDir=d:\BatchJobs\MorphIde\%SymLnkName%_%1_%2
  ::   set wrkDir=d:\BatchJobs\MorphIde\%SymLnkName%_%1_%2
:: Modification Done
  set ideWrkDir=%wrkDir%\jdevIde
  set fwkWrkDir=%wrkDir%\fwkWrkDir
  set myhtmlWrkDir=%wrkDir%\myhtmlWrkDir
  set bigIdeZip=%SymLnkName%_%1_%2.zip
  set bigIdeZipLocation=%wrkDir%\%bigIdeZip%

  call :blank %ideWrkDir%

rem  pushd %wrkDir%

    :: Unzip the original IDE zip into %ideWrkDir%
    pushd %ideWrkDir%
      call :printBanner Start unzipping small IDE %3 into %ideWrkDir% ...
      %JAR% -xf %3
      call :printBanner Completed unzip of small IDE %3
    popd

    :: (1) ssLabel (Source Safe label or "latest")
    :: (2) jdevRoot (jdev BUILT area)
    :: (3) srcRoot (Client side src area, where "myhtml" is)
    :: (4) fwkWorkArea (fwk temp. build area)
    :: (5) bldType (either "opt" or "dbg")
    :: (6) SSBranch
    set fwkbuild_cmd=%ideWrkDir%\fwkbuild.bat fwkBldStart %1 %ideWrkDir% %myhtmlWrkDir% %fwkWrkDir% %2 %4
    call :printBanner Start %fwkbuild_cmd%
    call %fwkbuild_cmd%
    call :printBanner End %fwkbuild_cmd%
    :: Cleanup up stuff just for opt build
    if /i "%2" EQU "OPT" (
      del/f/q %ideWrkDir%\fwkbuild.bat >nul
      del/f/q %ideWrkDir%\fwk_%1.zip    >nul
    )

    :: Jar the IDE %ideWrkDir%\* into the big IDE zip file
    pushd %ideWrkDir%
      call :printBanner Start creating big IDE zip [%bigIdeZipLocation%]
      %JAR% cfM %bigIdeZipLocation% .
      call :printBanner Completed creation of big IDE zip [%bigIdeZipLocation%]
    popd

    if /i "%2" EQU "DBG" (
      call :unix rm -rf %UNX_BLD%/%SymLnkName%_%1
      %DASH% Copy %bigIdeZipLocation% to %J%\NT\FWK\build\%SymLnkName%_%1
      %xcopy%/f %bigIdeZipLocation% %J%\NT\FWK\build\%SymLnkName%_%1\
      %xcopy%/f %3 %J%\NT\FWK\build\%SymLnkName%_%1\
      call :unix %UNX_BLD%/build napPush %SymLnkName%_%1 %SymLnkName%       %bigIdeZip%
      echo.
      %DASH% deleting BigIdeZip from IDE 
      call :unix rm %UNX_BLD%/%SymLnkName%_%1/%bigIdeZip%
    )
    if /i "%2" EQU "OPT" call :ExtNapPush %4 %bigIdeZipLocation% %1 %3

    :: if /i "%5" NEQ "patch" rmdir/s/q %pathToSmallIdeZipFile%

rem  popd

  :: Cleanup the mess
  echo.
  echo.
  echo.
  echo ***************** Cleaning Up! *****************
  call :pwd
  echo.
  echo rmdir/s/q %wrkDir%
  rmdir/s/q %wrkDir%
  echo.
  echo ***************** Done Cleaning Up! *****************
  echo.
  echo.

  call :printBanner End %0
goto :EOF


::************* [public]  CompileSsJdev        - Convinience routine to check out everything from SS and compile it.
:CompileSsJdev
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Convenience routine to check out everything from SS and compile it.
  %doc%.
  call :docParameters
  %doc%   ----- optional parameter(s) -----
  %doc%   1 = SS label name. Default is LATEST
  call :docExample
  %docEOF%

                  set lbl=latest
  if "%1" NEQ ""  set lbl=%1

  call :CompileSS jdev dbg %NT_BLD%\jdev %lbl% nojavac
  call :BldAppsExtensions %NT_BLD%\jdev jdev %lbl% N %NT_BLD%\jdev\jdev\appslibrt
goto :EOF


::************* [public]  IrepValidateXmlFiles - Validates xml files by running the IrepParser on them
:IrepValidateXmlFiles
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Validates xml files by running the IrepParser on them
  %doc%.
  call :docParameters
  %doc%   1 = SS Branch. (ie jdev, jdev57H, etc.)
  %doc%   2 = SS label name. Use LATEST if you want to checkout the latest out from SS.
  call :docExample
  %docEOF%

  set tmpDirName=IrepValidateXmlFilesTmp_%1_%2
  set NtTmpLocation=%NT_BLD%\%tmpDirName%
  set unixTmpLocation=%UNX_BLD%/%tmpDirName%

  call :blank %NtTmpLocation%

  pushd %NtTmpLocation%
    call :SsGetUtil . %2 true $/%1/myprojects/oracle/apps/fnd/*.xml
    call :Linux %UNX_BLD%/build ValidateWithIrep %unixTmpLocation% %RELEASE%
  popd

  rmdir/s/q %NtTmpLocation%
goto :EOF


::************* [public]  AnyChanges           - Have any changes occured since the last build?
:AnyChanges
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Have any changes occured since the last build
  %doc%.
  call :docParameters
  %doc%   1 = SS label name.
  call :docExample
  %docEOF%

  call :blank AnyChangesWrkDir
goto :EOF

::************* [public]  GetOpenDriveLetter   - Returns an open drive letter in the variable RET
:getOpenDriveLetter
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Returns an open drive letter in the variable RET. If open drive letter could not be found returns NO_OPEN_DRIVE_FOUND
  %doc% Looks for an open drive letter between F through Z.
  %doc%.
  call :docParameters none
  call :docExample
  %docEOF%

  set ret=NO_OPEN_DRIVE_FOUND
  for %%a in (f g i j k l m n o p q r s t u v w x) do if not exist %%a:  set ret=%%a:& if not exist %%a: goto :EOF

goto :EOF

::************* [public]  SynchSsToArcs        - Synchs up SS and ARCS (Currently does not handle OA_HTML directory)
:SynchSsToArcs
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Synchs up SS and ARCS (Only does java and BC4J xml files at the moment)
  %doc%.
  call :docParameters
  %doc%   CAUTION: Parameters for this routine are case sensitive
  %doc%   1 = Name of Synch directory (ie %T_FWK_BLD%\synchSsToArcs)
  %doc%   2 = Unix equivalent to parameter 1 (ie /nfs/group/jdevhome/FWK/build/synchSsToArcs)
  %doc%   3 = SS label name. Use LATEST if you want to checkout the latest out from SS.
  %doc%   4 = SS Branch. (ie jdev, jdev57H, etc.)
  %doc%   5 to N = Directories to synch up under ^$/^<param4^>/myprojects/oracle/apps/fnd.
  %doc%            This corresponds to /fnddev/fnd/11.5/java.
  call :docExample %T_FWK_BLD%\synchSsToArcs /nfs/group/jdevhome/FWK/build/synchSsToArcs 90380_554 jdev framework oalogviewer
  %docEOF%

  echo.
  call :printBanner Start %0 [%*]. Starting synching up SS to ARCS %dateTime% ...

  set synchDir=%1\%4_%3
  set unixRootDir=%2
  set unixSynchDir=%2/%4_%3
  set param=

  echo.
  %DASH% Cleanup if necessary ...
  call :unix rm -rf %unixSynchDir%
  call :blank %synchDir% %synchDir%\ss

  call :undoChkOutForSynch %synchDir%\ss\tmp %4

  pushd %synchDir%\ss
    :: get java files out from ss
    :chkOutSSLoop
      echo.
      call :printBanner Checking out files from SS $/%4/myprojects/oracle/apps/fnd/%5 ...
      call :SsChkOutUtil %synchDir%\ss\%5 %3 $/%4/myprojects/oracle/apps/fnd/%5
      set param=%param% %5
      shift /5
      if "%5" NEQ "" goto :chkOutSSLoop

    :: ADDED: Handle OA_HTML files
    echo.
    call :printBanner Checking out files from SS $/%4/myhtml/OA_HTML ...
    call :SsChkOutUtil %synchDir%\ss\html %3 $/%4/myhtml/OA_HTML
    :: ADDED: Handle OA_HTML files

    :: ADDED: fwkToolbox files
    echo.
    call :printBanner Building fwkToolbox.zip ...
    call :bldTutorial %4 dbg %3 %NT_BLD%\jdev
    :: ADDED: fwkToolbox files

    echo.
    %DASH% Removing unecessary files ...
    del/s/q/f %synchDir%\ss\package.html  2>nul
    del/s/q/f %synchDir%\ss\bc4j.xcfg     2>nul
    del/s/q/f %synchDir%\ss\vssver.scc    2>nul

    :: Jump to Unix and finish off the rest of this script.
    echo.
    call :printBanner Jump to Unix and start synchronizing SS files to ARCS ...
    call :linux %UNX_BLD%/build SynchSSToArcs %unixRootDir% %3 %4 %param%

    echo.
    call :printBanner Start synchronizing ARCS files back to SS ...
    %SS% checkin $/%4/myprojects/oracle/apps/fnd -R -I-Y -C"Synching up to get ARCS $header. Label %3"

    :: ADDED: Handle OA_HTML files
    echo.
    call :printBanner Start synchronizing ARCS html files back to SS ...
    %SS% checkin $/%4/myhtml/OA_HTML -R -I-Y -C"Synching up myhtml/OA_HTML to get ARCS $header."
    :: ADDED: Handle OA_HTML files

  popd

  call :undoChkOutForSynch %synchDir%\ss\tmp %4

  call :cleanupUtil  %unixRootDir%/ 7
goto :EOF


::************* [private] undoChkOutForSynch   - Undo checkout of ss files
:undoChkOutForSynch
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Undo checkout of ss files
  %doc%.
  call :docParameters
  %doc%   1 = Directory where SS files are to be placed after Unto Check Out (ie %NT_BLD%\synchSsToArcs\ss\tmp)
  %doc%   2 = SS Branch. (ie jdev, jdev57H, etc.)
  call :docExample %NT_BLD%\synchSsToArcs\ss\tmp jdev
  %docEOF%

  echo.
  call :printBanner Start undoing checkouts from SS $/%2 ...
  call :SsUndoChkOutUtil %1 $/%2

  :: ADDED: Handle OA_HTML files
  echo.
  call :printBanner Start undoing checkouts from SS $/%2/myhtml/OA_HTML ...
  call :SsUndoChkOutUtil %1 $/%2/myhtml/OA_HTML
  :: ADDED: Handle OA_HTML files

  :: ADDED: webProvider projects
  echo.
  call :printBanner Start undoing checkouts from SS $/webProvider/mainline/oracle/apps/fnd/framework ...
  call :SsUndoChkOutUtil %1 $/webProvider/mainline/oracle/apps/fnd/framework
  :: ADDED: webProvider projects

goto :EOF


::************* [private] SsUndoChkOutUtil     - Undo checkout of ss files
:SsUndoChkOutUtil
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Undo checkout of ss files
  %doc%.
  call :docParameters
  %doc%   1 = Directory where SS files are to be placed after Unto Check Out (ie %NT_BLD%\synchSsToArcs\ss\tmp)
  %doc%   2 = SS project (ie ^$/jdev/myprojects/oracle/apps/fnd/framework)
  call :docExample %NT_BLD%\synchSsToArcs\ss\tmp ^$/jdev/myprojects/oracle/apps/fnd/framework
  %docEOF%

  :: We need to do this because SS undocheckout creates directories recursively even
  :: after you request that it create no output (-G- flag)
  call :blank %1
  pushd %1
    %SS% undocheckout -r -G- -i-Y  %2
  popd
  rmdir/s/q %1
goto :EOF

::************* [public]  JavadocCheck         - Identify java files that do NOT have the string "javadoc_{audience}"
:JavadocCheck
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Identify java files that do NOT have the string "javadoc_{audience}"
  %doc%.
  call :docParameters
  %doc%   CAUTION: Parameters for this routine are case sensitive
  %doc%   1 = SS Branch. (ie jdev, jdev57H, etc.)
  call :docExample jdev
  %docEOF%

  echo.
  call :printBanner Start %0 [%*]. Starting javadoc audience tag check ...

  :: Convenience variables
  set tmpMsg=%T_FWK_BLD%\tmpMsg
  set tmpMsg1=%T_FWK_BLD%\tmpMsg1
  set tmpMsg2=%T_FWK_BLD%\tmpMsg2

  del/q/f %tmpMsg% %tmpMsg1% %tmpMsg2% 2>nul

  call :blank JavadocCheckWrkDir

  pushd JavadocCheckWrkDir
    ::  get java out from ss
    call :SsGetUtil oracle latest true $/%1/myprojects/oracle/*.java

    :: We don't need the files in the templates directory
    rmdir/s/q oracle\apps\fnd\framework\webui\templates

    :: findstr each java file for 'javadoc_'
    for /r . %%i in (*.java) do findstr /i /r /c:"\/\/.*javadoc_" %%i 1>nul & if errorlevel 1 echo %%i >> %tmpMsg2%

    if exist %tmpMsg2% (
      echo Subject: $/%1 java files that do not have javadoc_{audience}                                        > %tmpMsg1%
      echo As of %dateTime% these file^(s^) do not have "// javadoc_{audience}" in it.                        >> %tmpMsg1%
      echo.                                                                                                   >> %tmpMsg1%
      echo {audience} must be one of the following values:                                                    >> %tmpMsg1%
      echo   public   - dictates that javadoc for this class will be exposed to customers                     >> %tmpMsg1%
      echo   internal - dictates that javadoc for this class will be exposed to Oracle Applicaions Developers >> %tmpMsg1%
      echo   private  - dictates that javadoc for this class will be exposed to internal OA Framework Team    >> %tmpMsg1%
      echo.                                                                                                   >> %tmpMsg1%
      copy %tmpMsg1%+%tmpMsg2% %tmpMsg% 1>nul
      del/q/f %tmpMsg1% %tmpMsg2% 2>nul

      call :SendMail tmpMsg fwkdev_us@oracle.com fwk_dev_in@oracle.com richard.bartlett@oracle.com gustavo.jimenez@oracle.com
    ) else (
      echo Subject: $/%1 java files are in good shape.   > %tmpMsg%
      echo As of %dateTime% everything looks good.      >> %tmpMsg%
      echo.                                             >> %tmpMsg%
      call :SendMail tmpMsg mark.m.nakamura@oracle.com subhalaxmi.anaparthi@oracle.com sreedevi.ette@oracle.com
    )
  popd

  :: Cleanup
  rmdir/s/q JavadocCheckWrkDir
goto :EOF

::************* [public]  PostBldProcess       - Post build process
:PostBldProcess
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Post build process
  call :docParameters
  %doc%   1 = SS Branch. (ie jdev, jdev57H, etc.)
  call :docExample jdev
  %docEOF%

  echo.
  call :printBanner Start %0 [%*]. Starting Post Build Process ...

  call :IsLatestBldReady %1
  set currLabel=%ret%

  if /i "%currLabel%" EQU "N" (
    echo.
    %DASH% Mailing "Post Build Process Skipped" message ...

    echo Subject: Post build process skipped. No new label to process            > %T_FWK_BLD%\tmpPostBldMsg
    echo.                                                                       >> %T_FWK_BLD%\tmpPostBldMsg
    echo [%0 %*]                                                                >> %T_FWK_BLD%\tmpPostBldMsg
    echo.                                                                       >> %T_FWK_BLD%\tmpPostBldMsg
    echo %dateTime%                                                             >> %T_FWK_BLD%\tmpPostBldMsg
    echo.                                                                       >> %T_FWK_BLD%\tmpPostBldMsg
    echo The latest %1 build is not ready, skipping post build process.         >> %T_FWK_BLD%\tmpPostBldMsg

    call :SendMail tmpPostBldMsg richard.bartlett@oracle.com gustavo.jimenez@oracle.com idcjrad_in@oracle.com fwkrel_in@oracle.com

    goto :EOF
  )

  echo.
  echo ----------------------------------------------------------------------
  echo -----------------------     Post Build Process    --------------------
  echo ----------------------------------------------------------------------
  %DASH% [%0] for %currLabel%
  echo.
  call :SynchSsToArcs       %T_FWK_BLD%\synchSsToArcs /nfs/group/jdevhome/FWK/build/synchSsToArcs %currLabel% %1 framework oalogviewer preferences
rem TODO: Now that we run this synch only when after a label is applied, you can't assume
rem       that the new Jdev IDE is on the hard drive. Thus we need to execute MailJavaAPIDiffMsg
rem       when we know that the IDE is available.
rem  call :MailJavaAPIDiffMsg  %1 %currLabel%

  call :getDay %dateTime%
  set currentDay=%ret%
  if /i "%currentDay%" EQU "SUN"  call :JavadocCheck %1

  :: The file last_processed_jdev_build is referenced by IsLatestBldReady
  :: last_processed_jdev_build contains the version # of the last successful build that was processed by the build.bat
  echo.
  %DASH% Inserting "%currLabel%" into %NT_BLD%\last_processed_%1_build ...
  echo %currLabel%  > %NT_BLD%\last_processed_%1_build
  echo.
  echo ----------------------------------------------------------------------
  echo -----------------------   End Post Build Process    ------------------
  echo ----------------------------------------------------------------------
  echo.
  call :printBanner End %0

  copy %T_FWK_BLD%\JdevPostBldProcess\JdevPostBldProcess.log %T_FWK_BLD%\synchSsToArcs\%1_%currLabel%\

goto :EOF


::************* [private] MailJavaAPIDiffMsg   - Create API diff report and mail it to group
:MailJavaAPIDiffMsg
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Create API diff report and mail it to group
  %doc%.
  call :docParameters
  %doc%   1 = SS Branch. (ie jdev, jdev57H, etc.)
  %doc%   2 = Current Label Number (ie 90382_638)
  call :docExample jdev 90382_638
  %docEOF%

  call :blank build_MailJavaAPIDiffMsg_dir
  for /d %%i in (build_MailJavaAPIDiffMsg_dir) do set tmp_dir=%%~fi

  call :getLatestDir %NT_BLD%\%1_*_* 2

  :: Setup convinience variables
  set oldDir=%NT_BLD%\%ret%
  set oldLabel=%ret%
  set currLabel=%1_%2
  set currDir=%NT_BLD%\%currLabel%
  set apiDiffRpt=%tmp_dir%\apiDiffReport
  set tmpMailMsg=%T_FWK_BLD%\tmpMailMsg
  set tmpMailMsg1=%T_FWK_BLD%\tmpMailMsg1

  call :JavaAPIDiff %oldDir% %currDir% ZIP:fwk.zip %apiDiffRpt%

  echo Subject: Public/Protected API diffs in fwk.zip [%oldLabel% VS %currLabel%]  > %tmpMailMsg1%
  echo.                                                                           >> %tmpMailMsg1%
  echo Compared fwk.zip of [%oldLabel%] against [%currLabel%]                     >> %tmpMailMsg1%
  echo.                                                                           >> %tmpMailMsg1%
  echo The following public/protected API differences were detected:              >> %tmpMailMsg1%
  echo.                                                                           >> %tmpMailMsg1%

  type %tmpMailMsg1% %apiDiffRpt% > %tmpMailMsg%
  del/f/q %tmpMailMsg1% >nul 2>&1
  rmdir/s/q build_MailJavaAPIDiffMsg_dir

  call :SendMail tmpMailMsg richard.bartlett@oracle.com gustavo.jimenez@oracle.com subhalaxmi.anaparthi@oracle.com
goto :EOF

::************* [private] providerBldProcess   - Deploys provider files to jdev installations
:providerBldProcess
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Deploys provider files to jdev installations
  %doc%.
  call :docParameters none
  call :docExample
  %docEOF%

  call :printBanner Start %0 [%*]. Deploying provider files ...
  echo.
  call :unix %UNX_BLD%/build providerBldProcess
  echo.

  call :printBanner Building OJPD indexes ...
  echo.
  for /d %%i in (%J_NT%\510*)  do call :CreateOjpdIndexes %%i
  for /d %%i in (%J_NT%\57*)   do call :CreateOjpdIndexes %%i
  echo.
  call :printBanner All done
  echo.
goto :EOF

::************* [private] CreateOjpdIndexes    - Creates OJPD files.
:CreateOjpdIndexes
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Creates OJPD files.
  %doc%.
  call :docParameters
  %doc%   1 = Jdeveloper Installation Top (eg %J_NT%\510_e_392900)
  call :docExample %J_NT%\510_e_392900
  %docEOF%

  set jdev_user_home=%T_FWK_BLD%\jot
  call :blank %jdev_user_home%

  echo %1\jdev\bin\jdev.exe --SetMainClass=oracle.jdevimpl.jotimpl.addin.JotAddin
  %1\jdev\bin\jdev.exe --SetMainClass=oracle.jdevimpl.jotimpl.addin.JotAddin >nul 2>&1

goto :EOF

::************* [private] JavaAPIDiff          - Create diff report for all public/protected APIs
:JavaAPIDiff
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Create diff report for all public/protected APIs
  %doc%.
  call :docParameters
  %doc%   1 = Old Jdeveloper Installation (eg %NT_BLD%\jdev_90382_633)
  %doc%   2 = Current Jdeveloper Installation (eg %NT_BLD%\jdev_90382_634)
  %doc%   3 = Files that contains a list of classes (ie ZIP:fwk.zip)
  %doc%   ----- optional parameter(s) -----
  %doc%   4 = Java diff report file (ie c:\ApiDifferenceReport.txt)
  call :docExample %NT_BLD%\jdev_90382_633 %NT_BLD%\jdev_90382_634 ZIP:fwk.zip c:\ApiDifferenceReport.txt
  %docEOF%

  echo.
  call :printBanner Start %0 [%*]

  call :blank pf_tmp_wrk_dir
  for /d %%i in (pf_tmp_wrk_dir) do set wrk_dir=%%~fi

  set oldClassPathFile=%wrk_dir%\oldclasspath
  set currClassPathFile=%wrk_dir%\currclasspath

  echo.
  %DASH% Getting old classpath ...
  set gotClassPath=N
  set classpath=
  call :getOpenDriveLetter
  set tmpDriveForOldCP=%RET%
  call %1\build getclasspath %1 %tmpDriveForOldCP%
  echo %classpath%;%1\jdev\appslibrt\req.zip > %oldClassPathFile%

  echo.
  %DASH% Getting current classpath ...
  set gotClassPath=N
  set classpath=
  call :getOpenDriveLetter
  set tmpDriveForCurrCP=%RET%
  call %2\build getclasspath %2 %tmpDriveForCurrCP%
  echo %classpath%;%2\jdev\appslibrt\req.zip > %currClassPathFile%

  echo.
  if "%4" EQU "" (
    %DASH% Generating Java API Difference Report ...
    set output=%wrk_dir%\tmp_out_file
  ) else (
    set output=%4
    %DASH% Generating %4 ...
  )

  pushd %NT_BLD%
    %NT_BLD%\jdev\jdk\bin\java -Dmx256m -classpath %NT_BLD%;%NT_BLD%\jdev\jdev\lib\jdev-rt.jar JavaUtil getAPIDiff CURR_CLASSPATH_FILE:%currClassPathFile% OLD_CLASSPATH_FILE:%oldClassPathFile% %3 > %output%
  popd

  subst/d %tmpDriveForOldCP%
  subst/d %tmpDriveForCurrCP%
  del/f/q %oldClassPathFile% %currClassPathFile%  >nul 2>&1

  echo.
  if "%4" EQU "" (
    if exist %output% type %output%
    del/f/q %output%  >nul 2>&1
    %DASH% Completed Java API Difference Report
  ) else (
    %DASH% Completed %4
  )

  rmdir/s/q %wrk_dir%

  call :printBanner End %0
goto :EOF

::************* [private] IsLatestBldReady     - Returns the latest build version IF it is ready.
:IsLatestBldReady
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Returns the latest build version IF it is ready.
  %doc%.
  call :docParameters
  %doc%   1 = SS Branch. (ie jdev, jdev57H, etc.)
  call :docExample jdev
  %docEOF%

  set ssBranch=%1
  set previousBld=%NT_BLD%\last_processed_%ssBranch%_build
  call :getLatestSSLabel %ssBranch%
  set ss_label=%ret%
  set RET=N
  findstr /c:"%ss_label%" %previousBld% >nul & if errorlevel 1 set RET=%ss_label%

  echo Latest SS Label [%ss_label%]
  for /f %%a in ('type %previousBld%') do @echo Last Build Processed [%%a]
goto :EOF

::************* [private] getLatestSSLabel     - Gets the latest SS Label
:getLatestSSLabel
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Gets the latest SS label
  %doc%.
  call :docParameters
  %doc%   1 = SS Branch. (ie jdev, jdev57H, etc.)
  call :docExample jdev
  %docEOF%

  %ss% history $/%1 -l -#1 2>nul 1>ss_show_history_output
  set RET=failed
  for /f "tokens=2" %%a in ('findstr "Label:" ss_show_history_output') do set RET=%%a
  del/q ss_show_history_output
  set RET=%RET:"=%
goto :EOF


::************* [private] GetLatestDir         - Returns the Nth directory from a sorted directory list.
:GetLatestDir
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Returns the Nth directory from a sorted directory list.
  %doc%.
  call :docParameters
  %doc%   1 = Wild Card Directory Spec. A "dir/b/o:-n" will be executed on this parameter.
  %doc%   2 = Nth directory to be returned from above dir command
  call :docExample %NT_BLD%\jdev_*_* 1
  %docEOF%

  set GBL_COUNT=1
  for /f  %%i in ('dir/b/o:-n %1') do call :getLatestDirHelper %%i %2
goto :EOF

:getLatestDirHelper
  if "%GBL_COUNT%" EQU "%2" (
    set ret=%1
  )
  set /a GBL_COUNT=%GBL_COUNT% + 1
goto :EOF

::************* [private] CleanupUtil          - Generic Cleanup Utility
:CleanupUtil
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Generic Cleanup Utility
  %doc%.
  %doc% NOTE: This routine assumes that the naming convention of the Directory Spec
  %doc%       parameter will be sorted in reverse alpha order and then deleted.
  call :docParameters
  %doc%   CAUTION: Parameters for this routine are case sensitive
  %doc%   1 = Unix location to cleanup (ie %UNX_BLD%/jdev_903, %UNX_BLD%/jdev57h_903, etc)
  %doc%   2 = Number of Directories to Keep (valid values: 0 through N)
  %doc%         NOTE: 0 means any directories which match parameter 1 will be deleted!
  %doc%   3 to N = Repeat of parameters 1 and 2 as many times as you want
  call :docExample %UNX_BLD%/jdev_903 5 %UNX_BLD%/jdev57h_903 5 %J_UNX%/NT/FWK/share/jdev57_ 2
  %docEOF%

  call :unix %UNX_BLD%/build cleanupUtil %*

  ::   :drive_loop
  ::       pushd %1
  ::       set skip=
  ::       if /i "%3" NEQ "0" (
  ::         set skip="skip=%3"
  ::       )
  ::       for /f %skip% %%i in ('dir/a:d/b/o-n %2') do echo on & rmdir/s/q %%i & echo off
  ::       popd
  ::       shift /1
  ::       shift /1
  ::       shift /1
  ::       if /i "%1" NEQ "" goto :drive_loop
goto :EOF

::************* [private] BldBanner            - Print the standard start and end banners for product team builds.
:BldBanner
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Print the standard start and end banners for product team builds.
  call :docParameters
  %doc%   1 = start or end indicator. (ie start or end)
  %doc%   2 = Output location where zip files should go (Eg %J_NT%\provider\test\zip or h:\jdevhome\jdev)
  %doc%   3 = Product team code (Eg hz, bis, fwk, etc.)
  call :docExample start %J_NT%\provider\test\zip bis
  %docEOF%

  call :getDateTime

  echo.
  if /i "%1" EQU "start" (
    echo ======================================================
    echo Start building %2\%3*.zip files [%ret%] ....
    echo ======================================================
  ) else (
    echo ======================================================
    echo Finished building %2\%3*.zip files [%ret%]
    echo.
    dir %2\%3*.zip
    echo ======================================================
  )
goto :EOF


::************* [private] Res2Java             - Convert the Res.rts file to a Res.java file.
:Res2Java
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Convert the Res.rts file to a Res.java file.
  call :docParameters
  %doc% 1 = Location of Jdev installation (Eg %J_NT%\510_b_2990280 or %NT_BLD%\jdev)
  %doc% 2 = Java or Source Top (eg H:\jdevhome\jdev\myprojects)
  %doc% 3 = Location of rts-files.properties file (Eg H:\jdevhome\jdev\myprojects\oracle\apps\fnd\framework\dt\resource\rts-files.properties)
  call :docExample %J_NT%\510_b_2990280 h:\jdevhome\jdev\myprojects H:\jdevhome\jdev\myprojects\oracle\apps\fnd\framework\dt\resource\rts-files.properties
  %docEOF%

  echo.
  call :printBanner Start %0 [%*]

  :: Setup local convenience variables.
  set IDE=%1
  set SRC_TOP=%2
  set PROP_FILE=%3

  :: remove after bug 5075047 has been fixed
  set res2java_classpath=J:\NT\FWK\build\alan\rts2java.jar

  :: Posted email to Vijay that we are able to build the res*.java files w/out jd5rts15.jar.
  :: It appears that no 10131 ide has this jar file in it.
  :: So the question becomes ... do we really need it?
::  %IDE%\jdk\bin\java.exe -Dnls.build=true -Dnls.locales=ja -classpath %res2java_classpath%;%IDE%\jdev\lib\jd5rts15.jar;%IDE%\jlib\jewt4.jar;%IDE%\jlib\share.jar oracle.jdeveloper.rts.tools.Main %SRC_TOP% %PROP_FILE% %SRC_TOP%
  %IDE%\jdk\bin\java.exe -Dnls.build=true -Dnls.locales=ja -classpath %res2java_classpath%;%IDE%\jlib\jewt4.jar;%IDE%\jlib\share.jar oracle.jdeveloper.rts.tools.Main %SRC_TOP% %PROP_FILE% %SRC_TOP%
goto :EOF

::************* [public]  BldSharedZips        - Build server zip files for a product team
:BldSharedZips
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Build server zip files for a product team
  call :docParameters
  %doc% 1 = Location of myprojects\oracle\apps\[prod] directory (Eg h:\jdevhome\jdev)
  %doc% 2 = Location of Jdev installation (Eg %J_NT%\510_b_2990280 or %NT_BLD%\jdev)
  %doc% 3 = Output location where zip files should go (Eg %J_NT%\provider\test\zip or h:\jdevhome\jdev)
  %doc% 4 = Product team code (Eg hz, bis, fwk, etc.)
  %doc% 5 = Temporary Drive Letter (Eg I:, H:, etc)
  call :docExample h:\jdevhome\jdev %J_NT%\510_b_2990280 %J_NT%\provider\510_b_2990280\zip fwk I:
  %docEOF%

  echo.
  call :printBanner Start %0 [%*]

  :: Setup local convenience variables.
  set myprojects=%1\myprojects
  set myclasses=%1\myclasses

  echo.
  %DASH% Creating the %myclasses% area ....
  call :blank %myclasses%

  echo.
  %DASH% Copying %myprojects%\*.xml to %myclasses% ....
  xcopy/e/q/i %myprojects%\*.xml     %myclasses%\ 2>nul

  echo.
  %DASH% Removing all webui XML files from %myclasses% ....
  for /r %myclasses% /d %%i in (webui*) do if exist %%i\*.xml del/q/f %%i\*.xml 2>nul

  echo.
  %DASH% Compiling %4 java files ....
  for /r %myprojects% /d %%i in (*) do call :CompileIt %myprojects% %myclasses% Cp1252 %%i dbg %2 %5

  echo.
  %DASH% Creating %3\%4Src.zip ....
  pushd %myprojects%
    %JAR% cfM %3\%4Src.zip oracle
  popd

  echo.
  %DASH% Creating %3\%4.zip ....
  pushd %myclasses%
    %JAR% cf0 %3\%4.zip oracle
  popd

  echo.
  %DASH% Cleaning up %myclasses% ....
  rmdir/s/q %myclasses%

  call :printBanner End %0
goto :EOF

::************* [public]  DailyTest            - APPS daily 4pm build
:DailyTest
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% 4pm build of FWK components. Results logged do DailyTestBuild.log and emailed.
  call :docParameters
  %doc%   1 = SS Branch. (ie jdev, jdev57H, etc.)
  %doc%   2 = Location of Jdev installation (ie %NT_BLD%\jdev, %J_NT%\Jdev_57g_m36, etc.)
  %doc%   3 = SS label name. Use LATEST if you want to get the latest out from SS.
  call :docExample h:\jdevhome\jdev jdev %NT_BLD%\jdev latest
  %docEOF%

  echo.
  call :printBanner Start %0 [%*]

rem  call :DailyTestBld %1 %2 %3 > DailyTestBuild.log 2>&1
  call :DailyTestBld %1 %2 %3

  if defined errorlog (
    call :getTime %dateTime%
    set startTime=%RET%
    call :XcopyDelete DailyTestBuild.log %NT_BLD%\%1_%startTime%_failed
  )

  call :printBanner End %0
goto :EOF

::************* [private] DailyTestBld         - APPS daily sanity test build
:DailyTestBld
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Sanity test build of FWK components.
  %doc%.
  %doc% NOTE: This routine uses rsh to ap814sun.
  %doc%       In order to use this routine, your PC must be registered in /etc/hosts
  %doc%       and /etc/hosts.equiv on ap814sun.
  call :docParameters
  %doc%   1 = SS Branch. (ie jdev, jdev57H, etc.)
  %doc%   2 = Location of Jdev installation (ie %NT_BLD%\jdev, %J_NT%\Jdev_57g_m36, etc.)
  %doc%   3 = SS label name. Use LATEST if you want to get the latest out from SS.
  call :docExample h:\jdevhome\jdev jdev %NT_BLD%\jdev latest
  %docEOF%

  call :getTime %dateTime%
  set startTime=%RET%

  echo ----------------------------------------------------------------------
  call :printBanner Start %0 [%*]. Start %1 daily test build ...
  echo ----------------------------------------------------------------------

  set ToList=richard.bartlett@oracle.com gustavo.jimenez@oracle.com subhalaxmi.anaparthi@oracle.com  sreedevi.ette@oracle.com

  set daily=%1_%startTime%
  set dailyArea=%NT_BLD%\%daily%
  set dailyFailed=%daily%_failed
  set dailyFailedArea=%NT_BLD%\%dailyFailed%
  set dailyTmpArea=%dailyArea%_tmp

  echo.
  %DASH% Cleaning up old areas if necessary ...
  call :unix rm -rf %UNX_BLD%/%1_*_failed
  call :blank %dailyArea%

  call :NightBird c:\jdevhome\jdev %1 %2 %3 sanity_test %dailyArea% %2\jdev\appslibrt

  if defined errorlog (
rem    set ToList=%ToList% fwkdev_us@oracle.com fwk_dev_in@oracle.com
rem    rename %dailyArea% %dailyFailed%
rem
rem    echo Subject: DOHHH! %dateTime% FAILED for $/%1                                > %T_FWK_BLD%\tmp_mail_msg
rem    echo.                                                                         >> %T_FWK_BLD%\tmp_mail_msg
rem    echo DOHHH! Looks like we have a build break.                                 >> %T_FWK_BLD%\tmp_mail_msg
rem    echo Review %dailyFailedArea%\DailyTestBuild.log for errors.                  >> %T_FWK_BLD%\tmp_mail_msg
rem    echo Search for the string 'Compiling '. The errors should be near this area. >> %T_FWK_BLD%\tmp_mail_msg
rem    echo.                                                                         >> %T_FWK_BLD%\tmp_mail_msg
rem    echo You can view this log by getting the the J: drive. The J: drive can be   >> %T_FWK_BLD%\tmp_mail_msg
rem    echo accessed via 3 techniques:                                               >> %T_FWK_BLD%\tmp_mail_msg
rem    echo    1 Windows - Map J: to \\ap115nap\jdevbin                              >> %T_FWK_BLD%\tmp_mail_msg
rem    echo    2 Linux   - cd to /jdevbin                                            >> %T_FWK_BLD%\tmp_mail_msg
rem    echo    3 Browser - http://www-apps.us.oracle.com/fwk/jdevbin                 >> %T_FWK_BLD%\tmp_mail_msg
rem    echo.                                                                         >> %T_FWK_BLD%\tmp_mail_msg
rem    echo NOTE: If you do not find %dailyFailedArea%, this means that someone      >> %T_FWK_BLD%\tmp_mail_msg
rem    echo       has already fixed the problem and a new sanity test build has been >> %T_FWK_BLD%\tmp_mail_msg
rem    echo       resubmitted. The new sanity test build deleted the directory       >> %T_FWK_BLD%\tmp_mail_msg
rem    echo       %dailyFailedArea%.                                                 >> %T_FWK_BLD%\tmp_mail_msg
  ) else (
    echo.
    %DASH% Cleaning up build area ...

    call :unix rm -rf %UNX_BLD%/%daily%
    echo Subject: %dateTime% Succeeded for $/%1                                    > %T_FWK_BLD%\tmp_mail_msg
    echo.                                                                         >> %T_FWK_BLD%\tmp_mail_msg
    echo %dateTime% Succeeded for $/%1                                            >> %T_FWK_BLD%\tmp_mail_msg
  )

  call :SendMail tmp_mail_msg %ToList%

  echo.
  echo ----------------------------------------------------------------------
  call :printBanner End %0. %1 daily test build completed.
  echo ----------------------------------------------------------------------

  rmdir/s/q BldTmpWrkDir
goto :EOF

::************* [public]  NightBird            - APPS/TOOLS nightly 8pm build
:NightBird
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Nightly build for TOOLS group. Results logged do DailyTestBuild.log and emailed.
  %doc%.
  %doc% NOTE: In order to use this routine, your PC must be registered in /etc/hosts
  %doc%       and /etc/hosts.equiv on ap814sun.
  call :docParameters
  %doc%   1 = Location of Cabo images (ie h:\jdevhome\jdev)
  %doc%   2 = SS Branch. (ie jdev, jdev57H, etc.)
  %doc%   3 = Location of Jdev installation (ie %NT_BLD%\jdev, %J_NT%\Jdev_57g_m36, etc.)
  %doc%   4 = SS label name. Use LATEST if you want to get the latest out from SS.
  %doc%   5 = dbg or opt or sanity_test (dbg=build dbg zips or opt=build optimized zips)
  %doc%   6 = Output location (ie d:\work, c:\x\[date], etc.).
  %doc%   ----- optional parameter(s) -----
  %doc%   7 = Location of svc.zip (Usually param3\jdev\appslibrt but sometimes in param3\dbg)
  call :docExample h:\jdevhome\jdev jdev %NT_BLD%\jdev latest c:\temp
  %docEOF%

  echo ----------------------------------------------------------------------
  call :printBanner Start %0 [%*]
  echo ----------------------------------------------------------------------

  set dbgOptFlag=dbg
  if /i "%5" EQU "OPT"          set dbgOptFlag=opt

  set svcLocation=%6\%dbgOptFlag%
  if /i "%7" NEQ "" set svcLocation=%7
  call :BldServerZips %2 %dbgOptFlag% %3 %4 %6

rem  if /i "dbg" EQU "%dbgOptFlag%"  call :BldAppsExtensions %3 %2 %4 Y %svcLocation% %6\ext\dbg
  call :BldAppsExtensions %3 %2 %4 Y %svcLocation% %6\ext\dbg %dbgOptFlag%
  if /i "dbg" EQU "%dbgOptFlag%"  copy %6\ext\dbg\diagnostics.jar %6\dbg
rem  if /i "dbg" EQU "%dbgOptFlag%"  call :IrepValidateXmlFiles %2 %4

  if /i "%5" NEQ "sanity_test" (
    call :BldTutorial         %2 %dbgOptFlag% %4 no_fwktoolbox_zip %6
    call :BldBSOLabSolutions  %2 %dbgOptFlag% %4 no_fwktoolbox_zip %6
    call :BldBSOReferenceApp  %2 %dbgOptFlag% %4 no_fwktoolbox_zip %6
    call :BldMyhtml    %1 %2           %3 %4 %6
    call :BldFwkDeploy %1 %2           %3 %4 %6
    call :BldFwkMds    %2 %4           %6\xml

    if /i "%5" EQU "DBG"  call :BldReqDemo   %2 %dbgOptFlag% %4 no_fwktoolbox_zip %6

    echo.
    echo ----------------------------------------------------------------------
    call :printBanner Start javadoc process ...
    echo ----------------------------------------------------------------------
    mkdir %6\doc\%5
    call :BldFwkDoc    %2 %3 %4 jar public   %dbgOptFlag% %6
    move %6\doc\oafjavadoc_public.jar %6\doc\%5
    if /i "%5" EQU "DBG" (
      call :BldFwkDoc  %2 %3 %4 jar internal %dbgOptFlag% %6
      move %6\doc\oafjavadoc_internal.jar %6\doc\%5
      call :BldFwkDoc  %2 %3 %4 jar private  %dbgOptFlag% %6
      move %6\doc\oafjavadoc_private.jar %6\doc\%5
      copy %6\doc\%5\oafjavadoc_internal.jar %6\doc\%5\oafjavadoc.jar
    ) else (
      copy %6\doc\%5\oafjavadoc_public.jar %6\doc\%5\oafjavadoc.jar
      del/q/f %6\doc\%5\oafjavadoc_public.jar
    )
    del/q/f %6\doc\%5\aolj_ctdoc.zip %6\doc\%5\jdevdoc.zip

    echo.
    echo ----------------------------------------------------------------------
    call :printBanner End javadoc process
    echo ----------------------------------------------------------------------
  )

  if defined errorlog (
    echo.
    echo ----------------------------------------------------------------------
    echo ------------------ Compilation Problems Encountered ------------------
    echo ----------------------------------------------------------------------
  ) else (
    echo.
    echo ----------------------------------------------------------------------
    echo ------------------ NightBird Success! ------------------
    echo ----------------------------------------------------------------------
  )

  echo.
  echo ----------------------------------------------------------------------
  call :printBanner End %0
  echo ----------------------------------------------------------------------
goto :EOF

::************* [private] BldServerZips        - Builds fwk*.zip, req*.zip, svc*.zip and lessons*.zip.
:BldServerZips
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Builds fwk*.zip, req*.zip, svc*.zip and lessons*.zip.
  call :docParameters
  %doc%   1 = SS Branch. (ie jdev, jdev57H, etc.)
  %doc%   2 = dbg or opt (dbg=build dbg zips or opt=build optimized zips)
  %doc%   3 = Location of Jdev installation (ie %NT_BLD%\jdev, %J_NT%\Jdev_57g_m36, etc.)
  %doc%   4 = SS label name. Use LATEST if you want to get the latest out from SS.
  %doc%   5 = Output location (ie d:\work, c:\x\[date], etc.). Default is your current directory.
  call :docExample jdev dbg %NT_BLD%\jdev latest c:\temp
  %docEOF%

  echo.
  call :printBanner Start %0 [%*]. Creating server zip files ...

  if "%5" NEQ "" set slash=\

  set outDir=%5%slash%%2
  set outDirSrc=%5%slash%src
  set outDirDoc=%5%slash%doc\%2

  :: Create a temporary working directory
  call :blank BldServerZipsWrkDir

  del error.log 2>nul

  pushd BldServerZipsWrkDir
    call :compileSS %1 %2 %3 %4 javac true

    if "%ERROR_LEVEL%" NEQ "0" (
      set ERROR_LEVEL=0
      copy error.log ..\
      set errorlog=and error.log
      call :getDateTime

      echo Subject: %RET% FAILED for $/%1                                            > %T_FWK_BLD%\tmp_mail_msg
      echo.                                                                         >> %T_FWK_BLD%\tmp_mail_msg
      type error.log                                                                >> %T_FWK_BLD%\tmp_mail_msg
      del error.log
      call :SendMail %T_FWK_BLD%\tmp_mail_msg fwkdev_us@oracle.com fwk_dev_in@oracle.com fwkrel_in@oracle.com richard.bartlett@oracle.com gustavo.jimenez@oracle.com
    )

    echo.
    %DASH% Copy dependencies runtime files to the output location ...
    %XCOPY%/f   dependencies\%2\*.*  %outDir%\

    echo.
    %DASH% Copy dependencies source files to the output location ...
    %XCOPY%/f   dependencies\src\*.* %outDirSrc%\

    echo.
    %DASH% Copy dependencies javadoc files to the output location ...
    %XCOPY%/f   dependencies\doc\*.* %outDirDoc%\

    echo.
    %DASH% Copy XML files to myclasses ...
    xcopy/e/q/i myprojects\*.xml     myclasses\

    :: Zip Up fwkjbo*.zip, fwk*.zip, req*.zip and lessons.zip
    call :ZipIt fwkjbo  %3 %4 %FWK_JBO_PKGS%

    call :ZipIt portalFlexComps  %3 %4 %FWK_PORTAL_PKGS%

    :: For lessons*.zip make sure to delete the lessonSrc.zip (We don't need it
    :: because the source files will generally be in Tutorial.zip and the users
    :: will build their own class files based on the java files in Tutorial.zip.
    :: We need lesson.zip for the Apache area where users can't compile java files
    :: at all).
    :: Also, make sure to delete the lesson java files and classes after
    :: done w/ building the lesson*.zip files.
    if /i "%0" EQU ":bldserverzips" (
      call :ZipIt lesson %3 %4 %LESSON_PKGS%
      del/s/q/f ..\lessonSrc.zip  >nul 2>&1
    )

    rmdir/s/q  myclasses\oracle\apps\fnd\framework\toolbox
    rmdir/s/q  myprojects\oracle\apps\fnd\framework\toolbox
    rmdir/s/q  myclasses\oracle\apps\fnd\framework\svctoolbox
    rmdir/s/q  myprojects\oracle\apps\fnd\framework\svctoolbox

    call :ZipIt svc     %3 %4 %SVC_PKGS%

    :: Make sure to build svcTester stuff before FWK.ZIP, because the svc tester
    :: files should NOT be in FWK.zip.
    call :ZipIt svctester %3 %4 %SVC_TESTER_PKGS%
    rmdir/s/q myclasses\oracle\apps\fnd\framework\svctester
    rmdir/s/q myprojects\oracle\apps\fnd\framework\svctester

    call :ZipIt fwk     %3 %4 %FWK_PKGS%
    if /i "%0" EQU ":bldserverzips" (
      call :ZipIt req     %3 %4 %REQ_PKGS%
    )

  popd

  rmdir/s/q BldServerZipsWrkDir

  echo.
  %DASH% Copy fwk*.zip, and svc*.zip files to output location ...

  rename svctester.zip svctester.jar
  rename portalFlexComps.zip portalFlexComps.jar
  call :XcopyDelete svctester.jar    %outDir%
  call :XcopyDelete fwk.zip          %outDir%
  call :XcopyDelete fwkjbo.zip       %outDir%
  call :XcopyDelete portalFlexComps.jar %outDir%
  call :XcopyDelete svc.zip          %outDir%
  call :XcopyDelete fwkSrc.zip       %outDirSrc%
  call :XcopyDelete fwkjboSrc.zip    %outDirSrc%
  call :XcopyDelete portalFlexCompsSrc.zip  %outDirSrc%
  call :XcopyDelete svcSrc.zip       %outDirSrc%
  call :XcopyDelete svctesterSrc.zip %outDirSrc%

  if /i "%0" EQU ":bldserverzips" (
    echo.
    %DASH% Copy miscellaneous files to output location ...
    call :XcopyDelete lesson.zip    %outDir%
    call :XcopyDelete req.zip       %outDir%
    call :XcopyDelete error.log     %outDir%
    call :XcopyDelete reqSrc.zip    %outDirSrc%
  )

  echo.
  echo ---------- List of files created ----------
  dir/s/b %outDir% %outDirSrc%

  echo.
  call :printBanner End %0. Created server zip files %errorlog%
goto :EOF

::************* [public]  CompileSS            - Extracts files from SS and compiles it
:CompileSS
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Extracts files from SS and compiles it
  call :docParameters
  %doc%   1 = SS Branch. (ie jdev, jdev57H, etc.)
  %doc%   2 = dbg or opt (dbg=build dbg zips or opt=build optimized zips)
  %doc%   3 = Location of Jdev installation (ie %NT_BLD%\jdev, %J_NT%\Jdev_57g_m36, etc.)
  %doc%   4 = SS label name. Use LATEST if you want to get the latest out from SS.
  %doc%   5 = Perform Javac on explicit file list (javac or nojavac)
  %doc%   ----- optional parameter(s) -----
  %doc%   6 = Output files in current directory (True). Default is False, which means that
  %doc%       the output files will go into a temp directory. At the end of this method
  %doc%       the temp directory will be deleted.
  call :docExample jdev dbg %NT_BLD%\jdev latest nojavac
  %docEOF%

  set jdevIDE=%3
  set compile_with_javac=%5
  set compile_with_javac=nojavac

  %DASH% Creating temporary work area CompileSsWrkDir ...
  call :blank CompileSsWrkDir\myprojects\oracle CompileSsWrkDir\dependencies

  pushd CompileSsWrkDir\myprojects\oracle
    echo.
    call :SsGet $/%1/myprojects/oracle %4 true
  popd

  pushd CompileSsWrkDir\dependencies
    echo.
    call :SsGet $/%1/dependencies %4 true
  popd

  pushd CompileSsWrkDir
    :: Copy ARCS files to the dependencies directory
    :: NOTE: We are assuming that %NT_BLD%\ARCS is the common area used.
    ::       The bourne shell makes this assumption as well.
    :: TODO: We should streamline this so that opt and dbg executes the same code path. Need to modify setupclasspath to work w/ opt or dbg dependencies directory.
    echo.
    %DASH% Getting 3rdparty APPS zip files ...
    %xcopy%/f   %NT_BLD%\ARCS\%1\3rdparty\*.*   dependencies\dbg\
    %xcopy%/f   dependencies\fwk_version.txt    dependencies\dbg\

    call :UpdateFwkVersionTxt dbg %4

    if /i "%2" EQU "opt" (
      %xcopy%/f %NT_BLD%\ARCS\%1\3rdparty\*.*   dependencies\opt\
      %xcopy%/f dependencies\fwk_version.txt    dependencies\opt\
      call :UpdateFwkVersionTxt opt %4
    )

    :: When building fwk*.zip and req*.zip we don't need any java files from the
    :: following directories:
    rmdir/s/q myprojects\oracle\apps\fnd\framework\webui\templates 2>nul
    rmdir/s/q myprojects\oracle\svc\test                           2>nul
    rmdir/s/q myprojects\oracle\apps\fnd\framework\dt              2>nul

    :: Remove any unecessary files
    echo.
    %DASH% Deleting unecessary files ...
    del/s/q/f *.bak *.~* *.class >nul 2>&1

    echo.
    echo ----------------------------------------------------------------------
    echo Compiling FWK files ...
    echo ----------------------------------------------------------------------

    echo -----------------------------------------------------------------------
    call :getOpenDriveLetter
    set drvLtr=%RET%
    subst %drvLtr% %jdevIDE%
    call :GetIdeVersion %3
    set IdeVersion=%RET%
    if /i "%IdeVersion%" EQU "1013" (
    set Apps=dependencies\dbg\orai18n.jar;dependencies\dbg\ojdbc14.jar;dependencies\dbg\atg.zip;dependencies\dbg\collections.zip;dependencies\dbg\xmlparserv2.jar;dependencies\dbg\pat.zip;dependencies\dbg\concurrent.zip;dependencies\dbg\diagnostics.jar;dependencies\dbg\wsp.zip;dependencies\dbg\fwkCabo.zip;dependencies\dbg\wsrp-container.jar;dependencies\dbg\pdkjava.jar;dependencies\dbg\ptlshare.jar;dependencies\dbg\xml.jar;dependencies\dbg\wsrp-container-types.jar;dependencies\dbg\jaxb-impl.jar;dependencies\dbg\jaxb-libs.jar;dependencies\dbg\jazn.jar;dependencies\dbg\jazncore.jar
    ) else (
    set Apps=dependencies\dbg\orai18n.jar;dependencies\dbg\ojdbc14.jar;dependencies\dbg\appsSSO.zip;dependencies\dbg\aolj.jar;dependencies\dbg\oamMaintMode.zip;dependencies\dbg\flex.jar;dependencies\dbg\wf.zip;dependencies\dbg\ak.zip;dependencies\dbg\collections.zip;dependencies\dbg\xmlparserv2.jar;dependencies\dbg\jttComn.zip;dependencies\dbg\pat.zip;dependencies\dbg\concurrent.zip;dependencies\dbg\diagnostics.jar;dependencies\dbg\wsp.zip;dependencies\dbg\fwkCabo.zip;dependencies\dbg\wsrp-container.jar;dependencies\dbg\pdkjava.jar;dependencies\dbg\ptlshare.jar;dependencies\dbg\xml.jar;dependencies\dbg\wsrp-container-types.jar;dependencies\dbg\jaxb-impl.jar;dependencies\dbg\jaxb-libs.jar;dependencies\dbg\jazn.jar;dependencies\dbg\jazncore.jar
    )
    set BiBeans=%drvLtr%\bibeans\lib\bicmn.jar;%drvLtr%\bibeans\lib\bicmn-nls.zip;%drvLtr%\bibeans\lib\bipres.jar;%drvLtr%\bibeans\lib\bipres-nls.zip;%drvLtr%\bibeans\lib\bidatacmn.jar;%drvLtr%\bibeans\lib\biext.jar
    set Portal=%drvLtr%\jdev\appslibrt\portalFlexComps.jar
    set Uix=%drvLtr%\jdev\appslibrt\uix2.jar;%drvLtr%\jdev\appslibrt\share.jar;%drvLtr%\jdev\appslibrt\regexp.jar
    set Jdev=%drvLtr%\jlib\jdev-cm.jar

rem    if /i "%IdeVersion%" EQU "1013" (
      set OracleEl=%drvLtr%\jlib\oracle-el.jar;%drvLtr%\jlib\commons-el.jar;%drvLtr%\jlib\jsp-el-api.jar
      set Jrad=%drvLtr%\oaext\mds\lib\mdsrt.jar;%drvLtr%\oaext\lib\oamdsdt.jar;%drvLtr%\oaext\lib\mdsdt.jar
      set Bc4j=%drvLtr%\BC4J\lib\bc4jmt.jar;%drvLtr%\BC4J\lib\bc4jmtejb.jar;%drvLtr%\BC4J\lib\bc4jdomorcl.jar;%drvLtr%\BC4J\jlib\bc4jhtml.jar;%drvLtr%\BC4J\lib\bc4jct.jar
      set J2ee=%drvLtr%\j2ee\home\lib\jta.jar;%drvLtr%\j2ee\home\lib\ejb.jar;%drvLtr%\j2ee\home\lib\servlet.jar;%drvLtr%\j2ee\home\oc4jclient.jar;%drvLtr%\j2ee\home\lib\oc4j-internal.jar
      set Soap=%drvLtr%\webservices\lib\soap.jar
rem    ) else (
rem      set OracleEl=%drvLtr%\jakarta-commons-el\oracle-el.jar;%drvLtr%\jakarta-commons-el\commons-el.jar;%drvLtr%\jakarta-commons-el\jsp-el-api.jar
rem      set Jrad=%drvLtr%\mds\lib\mdsrt.jar;%drvLtr%\jdev\appslibrt\oamdsdt.jar;%drvLtr%\jdev\lib\mdsdt.jar
rem      set Bc4j=%drvLtr%\BC4J\lib\bc4jmt.jar;%drvLtr%\BC4J\lib\bc4jmtejb.jar;%drvLtr%\BC4J\lib\bc4jdomorcl.jar;%drvLtr%\BC4J\lib\bc4jhtml.jar;%drvLtr%\BC4J\lib\bc4jcmp.jar;%drvLtr%\BC4J\lib\bc4jct.jar
rem      set J2ee=%drvLtr%\j2ee\home\lib\jta.jar;%drvLtr%\j2ee\home\lib\ejb.jar;%drvLtr%\j2ee\home\lib\servlet.jar;%drvLtr%\j2ee\home\oc4j.jar
rem      set Soap=%drvLtr%\soap\lib\soap.jar
rem    )

    set CLASSPATH=myclasses;%drvLtr%\jdk\jre\lib\rt.jar;%Apps%;%BiBeans%;%Uix%;%Jrad%;%Bc4j%;%Jdev%;%J2ee%;%Soap%;%OracleEl%;%Portal%
    echo CLASSPATH=%CLASSPATH%
    echo -----------------------------------------------------------------------

    if /i "%2"=="opt" (
      set dbgFlag=-g:none -O
    ) else (
      set dbgFlag=-g
    )

    set compileCmd=%jdevIDE%\jdev\bin\ojc -recurse -encoding Cp1252 %dbgFlag% -nowarn -d myclasses -classpath %CLASSPATH% -sourcepath myprojects myprojects\*.java
    echo %compileCmd%

    %compileCmd%  >..\error.log 2>&1

    if "%errorlevel%" EQU "1" (
      set ERROR_LEVEL=1
      echo Compilation error encountered in BldServerZips >> ..\error.log
      type ..\error.log
    ) else (
      del ..\error.log
    )

    echo on
    if /i "%compile_with_javac%" EQU "javac" (
      %3\jdk\bin\javac -g -d myclasses -sourcepath myprojects myprojects\oracle\apps\fnd\framework\CreateIcxSession.java
      %3\jdk\bin\javac -g -d myclasses -sourcepath myprojects myprojects\oracle\apps\fnd\framework\webui\PPRHelper.java
      %3\jdk\bin\javac -g -d myclasses -sourcepath myprojects myprojects\oracle\apps\fnd\framework\OANLSServices.java
      %3\jdk\bin\javac -g -d myclasses -sourcepath myprojects myprojects\oracle\apps\fnd\framework\OAPassivationUtils.java
      %3\jdk\bin\javac -g -d myclasses -sourcepath myprojects myprojects\oracle\apps\fnd\framework\akhtml\webui\AkAmParamRegistryUpdateCO.java
      %3\jdk\bin\javac -g -d myclasses -sourcepath myprojects myprojects\oracle\apps\fnd\framework\attachments\util\DomAttachmentsUtils.java
      %3\jdk\bin\javac -g -d myclasses -sourcepath myprojects myprojects\oracle\apps\fnd\framework\attachments\webui\FndDocumentCatalogPageCO.java
      %3\jdk\bin\javac -g -d myclasses -sourcepath myprojects myprojects\oracle\apps\fnd\framework\custom\webui\CustomTableViewsUpdateCO.java
      %3\jdk\bin\javac -g -d myclasses -sourcepath myprojects myprojects\oracle\apps\fnd\framework\customjrad\webui\CustomJRADTableViewsUpdateCO.java
      %3\jdk\bin\javac -g -d myclasses -sourcepath myprojects myprojects\oracle\apps\fnd\framework\server\OAUtility.java
      %3\jdk\bin\javac -g -d myclasses -sourcepath myprojects myprojects\oracle\apps\fnd\framework\service\server\ApplicationModuleServiceImpl.java
      %3\jdk\bin\javac -g -d myclasses -sourcepath myprojects myprojects\oracle\apps\fnd\framework\service\server\ViewObjectServiceImpl.java
      %3\jdk\bin\javac -g -d myclasses -sourcepath myprojects myprojects\oracle\apps\fnd\framework\service\server\ejb\ServiceEJBHelper.java
      %3\jdk\bin\javac -g -d myclasses -sourcepath myprojects myprojects\oracle\apps\fnd\framework\webui\OAAdvancedTableHelper.java
      %3\jdk\bin\javac -g -d myclasses -sourcepath myprojects myprojects\oracle\apps\fnd\framework\webui\OAAttachmentImageHelper.java
      %3\jdk\bin\javac -g -d myclasses -sourcepath myprojects myprojects\oracle\apps\fnd\framework\webui\OAAttachmentTableHelper.java
      %3\jdk\bin\javac -g -d myclasses -sourcepath myprojects myprojects\oracle\apps\fnd\framework\webui\OABoundValueAttachmentTableChildNodeList.java
      %3\jdk\bin\javac -g -d myclasses -sourcepath myprojects myprojects\oracle\apps\fnd\framework\webui\OADataBoundValueCustomization.java
      %3\jdk\bin\javac -g -d myclasses -sourcepath myprojects myprojects\oracle\apps\fnd\framework\webui\OADataBoundValueId.java
      %3\jdk\bin\javac -g -d myclasses -sourcepath myprojects myprojects\oracle\apps\fnd\framework\webui\OADataBoundValueTableName.java
      %3\jdk\bin\javac -g -d myclasses -sourcepath myprojects myprojects\oracle\apps\fnd\framework\webui\OADateValidater.java
      %3\jdk\bin\javac -g -d myclasses -sourcepath myprojects myprojects\oracle\apps\fnd\framework\webui\OADescriptiveFlexHelper.java
      %3\jdk\bin\javac -g -d myclasses -sourcepath myprojects myprojects\oracle\apps\fnd\framework\webui\OAJSPHelper.java
      %3\jdk\bin\javac -g -d myclasses -sourcepath myprojects myprojects\oracle\apps\fnd\framework\webui\OAKeyFlexHelper.java
      %3\jdk\bin\javac -g -d myclasses -sourcepath myprojects myprojects\oracle\apps\fnd\framework\webui\OALovActionButtonHelper.java
      %3\jdk\bin\javac -g -d myclasses -sourcepath myprojects myprojects\oracle\apps\fnd\framework\webui\OAMessageAttachmentLinkHelper.java
      %3\jdk\bin\javac -g -d myclasses -sourcepath myprojects myprojects\oracle\apps\fnd\framework\webui\OAMessageInlineAttachmentHelper.java
      %3\jdk\bin\javac -g -d myclasses -sourcepath myprojects myprojects\oracle\apps\fnd\framework\webui\OAMessageLovChoiceHelper.java
      %3\jdk\bin\javac -g -d myclasses -sourcepath myprojects myprojects\oracle\apps\fnd\framework\webui\OAMessageLovInputHelper.java
      %3\jdk\bin\javac -g -d myclasses -sourcepath myprojects myprojects\oracle\apps\fnd\framework\webui\OAPageBean.java
      %3\jdk\bin\javac -g -d myclasses -sourcepath myprojects myprojects\oracle\apps\fnd\framework\webui\OAPageErrorHandler.java
      %3\jdk\bin\javac -g -d myclasses -sourcepath myprojects myprojects\oracle\apps\fnd\framework\webui\OAPageLayoutHelper.java
      %3\jdk\bin\javac -g -d myclasses -sourcepath myprojects myprojects\oracle\apps\fnd\framework\webui\OAPageSecurity.java
      %3\jdk\bin\javac -g -d myclasses -sourcepath myprojects myprojects\oracle\apps\fnd\framework\webui\OAQueryUtils.java
      %3\jdk\bin\javac -g -d myclasses -sourcepath myprojects myprojects\oracle\apps\fnd\framework\webui\OATableHelper.java
      %3\jdk\bin\javac -g -d myclasses -sourcepath myprojects myprojects\oracle\apps\fnd\framework\webui\OATotalRowHelper.java
      %3\jdk\bin\javac -g -d myclasses -sourcepath myprojects myprojects\oracle\apps\fnd\framework\webui\OATrainHelper.java
      %3\jdk\bin\javac -g -d myclasses -sourcepath myprojects myprojects\oracle\apps\fnd\framework\webui\OAUrl.java
      %3\jdk\bin\javac -g -d myclasses -sourcepath myprojects myprojects\oracle\apps\fnd\framework\webui\OAWebBeanBaseTableHelper.java
      %3\jdk\bin\javac -g -d myclasses -sourcepath myprojects myprojects\oracle\apps\fnd\framework\webui\OAWebBeanContainerHelper.java
      %3\jdk\bin\javac -g -d myclasses -sourcepath myprojects myprojects\oracle\apps\fnd\framework\webui\OAWebBeanDataAttributeHelper.java
      %3\jdk\bin\javac -g -d myclasses -sourcepath myprojects myprojects\oracle\apps\fnd\framework\webui\OAWebBeanDataHelper.java
      %3\jdk\bin\javac -g -d myclasses -sourcepath myprojects myprojects\oracle\apps\fnd\framework\webui\OAWebBeanFactoryImpl.java
      %3\jdk\bin\javac -g -d myclasses -sourcepath myprojects myprojects\oracle\apps\fnd\framework\webui\OAWebBeanFlexHelper.java
      %3\jdk\bin\javac -g -d myclasses -sourcepath myprojects myprojects\oracle\apps\fnd\framework\webui\OAWebBeanFormElementHelper.java
      %3\jdk\bin\javac -g -d myclasses -sourcepath myprojects myprojects\oracle\apps\fnd\framework\webui\OAWebBeanHelper.java
      %3\jdk\bin\javac -g -d myclasses -sourcepath myprojects myprojects\oracle\apps\fnd\framework\webui\OAWebBeanHGridHelper.java
      %3\jdk\bin\javac -g -d myclasses -sourcepath myprojects myprojects\oracle\apps\fnd\framework\webui\OAWebBeanHideShowHelper.java
      %3\jdk\bin\javac -g -d myclasses -sourcepath myprojects myprojects\oracle\apps\fnd\framework\webui\OAWebBeanLovHelper.java
      %3\jdk\bin\javac -g -d myclasses -sourcepath myprojects myprojects\oracle\apps\fnd\framework\webui\OAWebBeanMessageHelper.java
      %3\jdk\bin\javac -g -d myclasses -sourcepath myprojects myprojects\oracle\apps\fnd\framework\webui\OAWebBeanPickListHelper.java
      %3\jdk\bin\javac -g -d myclasses -sourcepath myprojects myprojects\oracle\apps\fnd\framework\webui\OAWebBeanUtils.java
      %3\jdk\bin\javac -g -d myclasses -sourcepath myprojects myprojects\oracle\jbo\server\ApplicationModuleServiceImpl.java
      %3\jdk\bin\javac -g -d myclasses -sourcepath myprojects myprojects\oracle\jbo\server\OAJboViewObjectImpl.java
    )
    echo off

    subst/d %drvLtr%

    if /i "%6" EQU "true" (
      xcopy/e/y dependencies\* ..\dependencies\ >nul
      xcopy/e/y myclasses\*    ..\myclasses\    >nul
      xcopy/e/y myprojects\*   ..\myprojects\   >nul
    )

  popd
  %DASH% Cleaning up temporary work area CompileSsWrkDir ...
  rmdir/s/q CompileSsWrkDir

goto :EOF

:UpdateFwkVersionTxt
  set tmp1=dbg
  set tmp2=Debug
  if /i "%1" EQU "opt"  set tmp1=opt
  if /i "%1" EQU "opt"  set tmp2=Optimized

  echo   ^<component name= "Build Type"^>       >> dependencies\%tmp1%\fwk_version.txt
  echo     ^<version^>%tmp2%^</version^>        >> dependencies\%tmp1%\fwk_version.txt
  echo   ^</component^>                         >> dependencies\%tmp1%\fwk_version.txt
  echo  ^<component name= "OA Framework"^>      >> dependencies\%tmp1%\fwk_version.txt
  echo    ^<version^>%RELEASE% (%2)^</version^> >> dependencies\%tmp1%\fwk_version.txt
  echo  ^</component^>                          >> dependencies\%tmp1%\fwk_version.txt

goto :EOF

::************* [private] BldWpAndHpZip        - Builds WebProvider and HomePage zip files.
:BldWpAndHpZip
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Builds WebProvider and HomePage zip files
  call :docParameters
  %doc%   1 = Output location (ie %T_FWK_BLD%\webprovider)
  call :docExample %T_FWK_BLD%\webprovider
  %docEOF%

  echo.
  call :printBanner Start %0 [%*]. Executing BldWpAndHpZip ...

  call :WpAndHpProcessor %1

  echo.
  call :printBanner End %0. Created fwkwp*.zip and fwkhp*.zip files

goto :EOF

::************* [private] BldAppsExtensions    - Builds APPS extensions to Jdeveloper
:BldAppsExtensions
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Builds Apps Extension for Jdeveloper
  call :docParameters
  %doc%   1 = Location of Jdev installation (ie %NT_BLD%\jdev)
  %doc%   2 = SS Branch. (ie jdev, jdev57H, etc.)
  %doc%   3 = SS label name. Use LATEST if you want to get the latest out from SS.
  %doc%   4 = Build zip file? Y or N
  %doc%   5 = Location of svc.zip. DO NOT include svc.zip as part of this parameter. (Usually %NT_BLD%\jdev\jdev\appslibrt but sometimes in param6\ext\dbg)
  %doc%   ----- optional parameter(s) -----
  %doc%   6 = Output location (ie D:\wrk\ext\dbg)
  %doc%   7 = dbg or opt (dbg=build dbg zip or opt=build optimized zip)
  call :docExample %NT_BLD%\jdev jdev latest Y %NT_BLD%\jdev\jdev\appslibrt D:\wrk\ext\dbg dbg
  %docEOF%

  echo.
  call :printBanner Start %0 [%*]

  del/q/f error.log >nul 2>&1

  set jdevIDE=%1
  set ssBranch=%2
  set ssLabel=%3
  set bldZip=%4
  set svcLocation=%5
  set outDir=%6
  if "%outDir%" EQU "" set outDir=..
  if /i "%7" NEQ "" set dbgOptFlag=%7

  call :blank BldAppsExtensionWrkDir\myprojects\oracle\apps\fnd\framework\dt BldAppsExtensionWrkDir\myprojects\oracle\jbo\common

  call :blank BldAppsExtensionWrkDir\myprojects\META-INF
  pushd BldAppsExtensionWrkDir\myprojects\META-INF
    call :SsGet $/%ssBranch%/myprojects/META-INF/extension.xml            %ssLabel% false
  popd

  pushd BldAppsExtensionWrkDir\myprojects\oracle\apps\fnd\framework\dt
    call :SsGet $/%ssBranch%/myprojects/oracle/apps/fnd/framework/dt        %ssLabel% true
  popd

  pushd BldAppsExtensionWrkDir\myprojects\oracle\jbo\common
    call :SsGet $/%ssBranch%/myprojects/oracle/jbo/common/ServiceUtils.java %ssLabel% false
  popd

  pushd BldAppsExtensionWrkDir
    call :SsGet $/%ssBranch%/dependencies/dbg/diagnostics.jar %ssLabel% false

    call :Res2Java %jdevIDE% myprojects myprojects\oracle\apps\fnd\framework\dt\resource\rts-files.properties

    :: Get Classpath
    :: TODO: We have a problem here w/ svc.zip. If in the future we have a "direct" compile time depenency, we will run into problems.

    set CLASSPATH=.;diagnostics.jar;%svcLocation%\svc.zip;%jdevIDE%\BC4J\jlib\bc4jdatum.jar;%jdevIDE%\BC4J\jlib\bc4jtester.jar;%jdevIDE%\BC4J\lib\adfshare.jar;%jdevIDE%\BC4J\lib\bc4jct.jar;%jdevIDE%\BC4J\lib\bc4jdomorcl.jar;%jdevIDE%\BC4J\lib\bc4jmt.jar;%jdevIDE%\BC4J\lib\collections.jar;%jdevIDE%\oaext\lib\mdsdt.jar;%jdevIDE%\oaext\lib\oamdsdt.jar;%jdevIDE%\oaext\mds\lib\mdsrt.jar;%jdevIDE%\jdev\extensions\oracle.BC4J.10.1.3.jar;%jdevIDE%\jdev\extensions\oracle.oaext.10.1.3.jar;%jdevIDE%\jdev\lib\jdev.jar;%jdevIDE%\jdev\lib\xmladdin.jar;%jdevIDE%\adfdt\lib\adfdt_common.jar;%jdevIDE%\adfdt\lib\adfdt_jdev.jar;%jdevIDE%\adfdt\lib\adfdt_mds.jar;%jdevIDE%\diagnostics\lib\ojdl.jar;%jdevIDE%\ide\lib\ide.jar;%jdevIDE%\ide\lib\javatools.jar;%jdevIDE%\jdbc\lib\ocrs12.jar;%jdevIDE%\jdbc\lib\ojdbc14dms.jar;%jdevIDE%\jdbc\lib\orai18n.jar;%jdevIDE%\jlib\commons-el.jar;%jdevIDE%\jlib\help4.jar;%jdevIDE%\jlib\jdev-cm.jar;%jdevIDE%\jlib\jdev-cm.jar;%jdevIDE%\jlib\jewt4.jar;%jdevIDE%\jlib\jsp-el-api.jar;%jdevIDE%\jlib\ojmisc.jar;%jdevIDE%\jlib\ojmisc.jar;%jdevIDE%\jlib\oracle-el.jar;%jdevIDE%\jlib\oracle-ice.jar;%jdevIDE%\jlib\regexp.jar;%jdevIDE%\jlib\share.jar;%jdevIDE%\lib\dms.jar;%jdevIDE%\lib\xmlparserv2.jar

    echo -----------------------------------------------------------------------
    echo ClassPath=%CLASSPATH%
    echo -----------------------------------------------------------------------

    :: Compile files
    %DASH% Compiling *.java ...
    echo.
    if /i "%dbgOptFlag%"=="opt" (
      set dbgFlag=-g:none -O
    ) else (
      set dbgFlag=-g
    )
    echo "creating %dbgOptFlag% zip"
    set compileCmd=%jdevIDE%\jdev\bin\ojc -recurse %dbgFlag% -nowarn -d . -classpath %CLASSPATH% -sourcepath myprojects myprojects\*.java
    echo %compileCmd%
    %compileCmd%  >..\error.log 2>&1

    if "%errorlevel%" EQU "1" (
      %DASH% %0 Compilation Failure!
      echo Error compiling oracle.apps.fnd.framework.dt.* >> ..\error.log
      type ..\error.log
      set errorlog=BldAppsExtensions failed
    ) else (
      %DASH% %0 Successful compile!
      if /i "%bldZip%" EQU "Y" (
        echo.
        if not exist %outDir% call :blank %outDir%

        %DASH% Zipping up %outDir%\oracle.Service.10.1.3.jar ...
        del/f diagnostics.jar
        mkdir META-INF
        move myprojects\META-INF\* META-INF\
        %DASH% %JAR% cf0 %outDir%\oracle.Service.10.1.3.jar META-INF oracle
        %JAR% cf0 %outDir%\oracle.Service.10.1.3.jar META-INF oracle
      )
    )
  popd

  rmdir/s/q BldAppsExtensionWrkDir

  echo.
  call :printBanner End %0. %msg%

goto :EOF

::************* [private] WpAndHpProcessor     - Handles processing of WP and HP zip files.
:WpAndHpProcessor
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Handles processing of WP and HP zip files.
  call :docParameters
  %doc%   1 = Output location (ie %T_FWK_BLD%\webprovider)
  call :docExample %T_FWK_BLD%\webprovider
  %docEOF%

  echo.
  :: convenience variable
  set outDir=%1\57

  echo.
  call :printBanner Start %0 [%*]. Creating fwkwp*.zip and fwkhp*.zip files based on FWK 57 ...

  pushd %outDir%
    :: Get rid of error.log if necessary.
    del/q/f error.log >nul 2>&1

    call :GetLatestDir %J_NT%\57_* 1
    set ide=%J_NT%\%RET%

    %DASH% Using %ide% for compilation

    call :BldWpAndHpArea webProvider/mainline         %ide% latest fwkwp
    call :BldWpAndHpArea portlets_homepage57/mainline %ide% latest fwkhp

    :: Do we have a probem?
    set toList="fwkwpdev_us@oracle.com richard.bartlett@oracle.com gustavo.jimenez@oracle.com"
    if exist error.log (
      echo Subject: 57 WebProvider and-or HomePage build failed [%dateTime%]            > %T_FWK_BLD%\tmp_mail_msg
      echo 57 See %1\BldWpAndHpZip.log for compilation errors.                         >> %T_FWK_BLD%\tmp_mail_msg
    ) else (
      echo Subject: 57 WebProvider and-or HomePage build succeeded [%dateTime%]         > %T_FWK_BLD%\tmp_mail_msg
      echo 57 WebProvider and HomePage build succeeded. Zip files located in %outDir%  >> %T_FWK_BLD%\tmp_mail_msg
    )
    call :SendMail tmp_mail_msg %toList%
  popd

  call :printBanner End %0
goto :EOF

::************* [private] BldWpAndHpArea       - Builds directories for WebProvider and HomePage files
:BldWpAndHpArea
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Builds zip files for other SS branches (ie $/webProvider, etc)
  call :docParameters
  %doc%   1 = SS Branch that points to the oracle project. (ie webProvider/mainline, portlets_homepage/mainline, etc)
  %doc%   2 = Location of Jdev installation (ie %NT_BLD%\jdev, %J_NT%\Jdev_57g_m36, etc.)
  %doc%   3 = SS label name. Use LATEST if you want to get the latest out from SS.
  %doc%   4 = Zip file name (ie fwkwp, fwkhp, etc)
  call :docExample webProvider/mainline %J_NT%\510_f_3311604 latest fwkwp
  %docEOF%

  call :printBanner Start %0 [%*]
  :: convenience variables
  set branch=%1
  set ide=%2
  set ssLabel=%3
  set zipName=%4

  echo.
  %DASH% Creating %zipName%*.zip files ...

  call :getLocalDir
  set currDir=%ret%

  :: Create a temporary working directory
  call :blank BldWpAndHpAreaWrkDir BldWpAndHpAreaWrkDir\myprojects BldWpAndHpAreaWrkDir\myprojects\oracle\apps\fnd\framework\util\provider

  pushd BldWpAndHpAreaWrkDir\myprojects
    :: Get the java and xml files for the myprojects directory
    echo.
    call :SsGet $/%branch% %ssLabel% true
    pushd oracle\apps\fnd\framework\util\provider
      call :SsGet $/portlets_homepage57/mainline/oracle/apps/fnd/framework/util/provider/OAFrameworkProviderUtil.java %ssLabel% false
    popd

    :: Remove any unecessary files
    echo.
    %DASH% Deleting unecessary files ...
    del/s/q/f *.bak *.~* *.jpr *.jpx *.jws *.class *.txt >nul 2>&1
  popd

  call :getOpenDriveLetter
  set drvLetter=%RET%

  set gotClassPath=N
  call %ide%\build getStandardClassPath . %ide% %drvLetter%
  set classpath=%currDir%\BldWpAndHpAreaWrkDir\myprojects\jpdk\provider.jar;dependencies\dbg\oamMaintMode.zip;%classpath%
  set classpath=%T_FWK_BLD%\webprovider\57\aolj.jar;%T_FWK_BLD%\webprovider\57;%T_FWK_BLD%\webprovider\57\appsSSO.zip;%T_FWK_BLD%\webprovider\57\j3061241.zip;%T_FWK_BLD%\webprovider\57\j3184265.zip;%T_FWK_BLD%\webprovider\57\oamMaintMode.zip;%T_FWK_BLD%\webprovider\57\concurrent.zip;%classpath%

  pushd BldWpAndHpAreaWrkDir
    echo ClassPath=%classpath%
    call :BldSharedZips %currDir%\BldWpAndHpAreaWrkDir %ide% %currDir% %zipName% %drvLetter%
    subst/d %drvLetter%
  popd
  rmdir/s/q BldWpAndHpAreaWrkDir

  echo.
  call :printBanner End %0. Created %zipName%*.zip files.
goto :EOF

::************* [private] getLocalDir          - Returns the local directory in the variable RET
:getLocalDir
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Returns the local directory in the variable RET
  call :docParameters none
  call :docExample
  %docEOF%

  for /d %%i in (.) do set ret=%%~fi

goto :EOF

::************* [private] BldFwkMds            - Builds fwkMds.zip
:BldFwkMds
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Builds fwkMds.zip
  call :docParameters
  %doc%   1 = SS Branch. (ie jdev, jdev57H, etc.)
  %doc%   2 = SS label name. Use LATEST if you want to get the latest out from SS.
  %doc%   3 = Output location (ie d:\tmp\xml). Default is your current directory.
  call :docExample jdev 90382_651 c:\tmp\xml
  %docEOF%

  echo.
  call :printBanner Start %0 [%*]. Creating fwkMds.zip ...

  call :blank BldFwkMdsWrkDir %3
  pushd BldFwkMdsWrkDir
    call :getRegionXmlFiles mds %1 %2 %3\fwkMds.txt1
    del/q/f %3\fwkMds.txt 2>nul
    for /f %%i in (%3\fwkMds.txt1) do @echo jdev\oamdsxml\fwk\%%i >> %3\fwkMds.txt
    del/q/f %3\fwkMds.txt1 2>nul

    pushd mds
      echo.
      %DASH% Creating %3\fwkMds.zip ...
      %JAR% cf0 %3\fwkMds.zip oracle
    popd
  popd

  rmdir/s/q BldFwkMdsWrkDir

  echo.
  call :printBanner End %0. Created %3\fwkMds.zip %3\fwkMds.txt.
goto :EOF

::************* [private] BldFwkDeploy         - Builds fwk_deploy.zip
:BldFwkDeploy
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Builds fwk_deploy.zip
  call :docParameters
  %doc%   1 = Location of Cabo images (ie h:\jdevhome\jdev)
  %doc%   2 = SS Branch. (ie jdev, jdev57H, etc.)
  %doc%   3 = Location of Jdev installation (ie %NT_BLD%\jdev, %J_NT%\Jdev_57g_m36, etc.)
  %doc%   4 = SS label name. Use LATEST if you want to get the latest out from SS.
  %doc%   ----- optional parameter(s) -----
  %doc%   5 = Output location (ie d:\work, c:\x\[date], etc.). Default is your current directory.
  call :docExample h:\jdevhome\jdev jdev %NT_BLD%\jdev latest c:\temp
  %docEOF%

  echo.
  call :printBanner Start %0 [%*]. Creating fwk_deploy.zip ...

  call :blank BldFwkDeployWrkDir

  pushd BldFwkDeployWrkDir
    mkdir jdev\myhtml

    echo.
    %DASH% Copy OA_HTML and OA_MEDIA files ...
    xcopy/e/q/i/y %1\myhtml\OA_HTML                 jdev\myhtml\OA_HTML                >nul
    xcopy/e/q/i/y %NT_BLD%\ARCS\%2\jsp              jdev\myhtml\OA_HTML                >nul
    xcopy/e/q/i/y %1\myhtml\OA_MEDIA                jdev\myhtml\OA_MEDIA               >nul
    xcopy/e/q/i/y %1\myhtml\OA_MEDIA\FNDEMAIL.gif   jdev\myhtml\OA_HTML\cabo\OAImages\ >nul
    xcopy/e/q/i/y %1\myhtml\OA_MEDIA\FNDFHELP.gif   jdev\myhtml\OA_HTML\cabo\OAImages\ >nul
    xcopy/e/q/i/y %1\myhtml\OA_MEDIA\FNDLOGOF.gif   jdev\myhtml\OA_HTML\cabo\OAImages\ >nul
    xcopy/e/q/i/y %1\myhtml\OA_MEDIA\FNDPORTL.gif   jdev\myhtml\OA_HTML\cabo\OAImages\ >nul
    xcopy/e/q/i/y %1\myhtml\OA_MEDIA\FNDPREFS.gif   jdev\myhtml\OA_HTML\cabo\OAImages\ >nul
    xcopy/e/q/i/y %1\myhtml\OA_MEDIA\showlog.gif    jdev\myhtml\OA_HTML\cabo\OAImages\ >nul
    xcopy/e/q/i/y %1\myhtml\OA_MEDIA\*greyscale.gif jdev\myhtml\OA_HTML\cabo\OAImages\ >nul

    if exist jdev\myhtml\OA_MEDIA\cabo\cache       rmdir/s/q jdev\myhtml\OA_MEDIA\cabo\cache
    if exist jdev\myhtml\OA_HTML\cabo\styles\cache rmdir/s/q jdev\myhtml\OA_HTML\cabo\styles\cache
    if exist jdev\myhtml\OA_HTML\jrad              rmdir/s/q jdev\myhtml\OA_HTML\jrad
    if exist jdev\myhtml\OA_HTML\secure            rmdir/s/q jdev\myhtml\OA_HTML\secure

    echo.
    %DASH% Get myhtml files from SS ...
    call :SsGetUtil jdev\myhtml %4 true $/%2/myhtml/*.*

    if exist jdev\myhtml\OA_HTML\web-inf (
      rename jdev\myhtml\OA_HTML\web-inf  web-inf2
      rename jdev\myhtml\OA_HTML\web-inf2 WEB-INF
    )

    if exist jdev\myhtml\OA_MEDIA\web-inf (
      rename jdev\myhtml\OA_MEDIA\web-inf  web-inf2
      rename jdev\myhtml\OA_MEDIA\web-inf2 WEB-INF
    )

    echo.
    %DASH% Delete unecessary files ...
    del/s/q/f OAInternalTest.jsp test*.jsp navigate.jsp CustomizationTest.jsp FWK_TBX_*.xml *.scc SJ_*.xml *.bak *.~* >nul 2>&1

    call :createOaVersionFile %4 jdev\oa_version.txt %3

    if "%5" NEQ "" (
      xcopy/q/y jdev\myhtml\OA_HTML\secure\*.dbc  %5  >nul 2>&1
    ) else (
      xcopy/q/y jdev\myhtml\OA_HTML\secure\*.dbc  ..\ >nul 2>&1
    )

    del/f/s jdev\myhtml\OA_HTML\secure\*.dbc  >nul 2>&1

    %JAR% cfM ..\fwk_deploy.zip *
  popd

  rmdir/s/q BldFwkDeployWrkDir

  if "%5" NEQ "" (
    echo.
    %DASH% Moving fwk_deploy.zip ...
    call :XcopyDelete fwk_deploy.zip  %5
  )

  call :printBanner End %0. Created fwk_deploy.zip
goto :EOF

::************* [private] BldTutorial          - Builds Tutorial*.zip
::************* [private] BldBSOLabSolutions   - Builds BSOLabSolutions*.zip
::************* [private] BldBSOReferenceApp   - Builds BSOReferenceApp*.zip
::************* [private] BldReqDemo           - Builds ReqDemo*.zip
:BldTutorial
:BldBSOLabSolutions
:BldBSOReferenceApp
:BldReqDemo
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  if /i "%0" EQU ":bldtutorial" %doc% Builds Tutorial*.zip
  if /i "%0" EQU ":bldbsolabsolutions" %doc% Builds BSOLabSolutions*.zip
  if /i "%0" EQU ":bldbsoreferenceapp" %doc% Builds BSOReferenceApp*.zip
  if /i "%0" EQU ":bldreqdemo"  %doc% Builds ReqDemo*.zip
  call :docParameters
  %doc%   1 = SS Branch. (ie jdev, jdev57H, etc.)
  %doc%   2 = dbg or opt (dbg=include "dev115" in jpx. opt=blank out "dev115" from jpx)
  %doc%   3 = SS label name. Use LATEST if you want to get the latest out from SS.
  %doc%   4 = Build fwkToolbox.zip or not. If you want to build fwkToolbox.zip you need to provide the
  %doc%       Location of Jdev installation (ie %NT_BLD%\jdev, %J_NT%\Jdev_57g_m36, etc.).
  %doc%       If you prefer to bypass building fwkToolbox.zip pass in the string no_fwktoolbox_zip.
  %doc%   ----- optional parameter(s) -----
  %doc%   5 = Output location (ie d:\work, c:\x\[date], etc.). Default is your current directory.
  call :docExample jdev dbg latest %NT_BLD%\jdev c:\temp
  %docEOF%

  echo.
  call :printBanner Start %0 [%*]. Creating Tutorial/BSOLabSolutions/ReqDemo ...

  call :blank BldTutorialWrkDir

  pushd BldTutorialWrkDir
    if /i "%0" EQU ":bldtutorial" (
      echo .
      echo Creating Tutorial ....
      call :SsGetUtil jdev\myhtml\OA_HTML                               %3 false $/%1/myhtml/OA_HTML/test_fwk*.jsp
      call :SsGetUtil jdev\myprojects                                   %3 false $/%1/myprojects/LabSolutions*.jp* $/%1/myprojects/Tutorial*.jp* $/%1/myprojects/SampleLibrary*.jp* $/%1/myprojects/ExtendLabSolutions*.jp* $/%1/myprojects/toolbox.jws
      call :SsGetUtil jdev\myprojects\oracle\apps\fnd\framework\toolbox %3 true  $/%1/myprojects/oracle/apps/fnd/framework/toolbox/*.*
      call :SsGetUtil jdev\myprojects\mycompany                         %3 true  $/%1/myprojects/mycompany/*.*

      attrib -R jdev\myprojects\*.jpx

      if /i "%2" EQU "dbg" (
        set zipName=Tutorial
        del/q jdev\myprojects\*_customer.jpx
      ) else (
        set zipName=Tutorial_customer
        del/q jdev\myprojects\Tutorial.jpx jdev\myprojects\LabSolutions.jpx jdev\myprojects\ExtendLabSolutions.jpx jdev\myprojects\SampleLibrary.jpx

        del/s/q/f bc4j.xcfg                                                                                     >nul 2>&1
        del/s/q/f jdev\myprojects\oracle\apps\fnd\framework\toolbox\labsolutions\test\SupplierServiceTest.java  >nul 2>&1
        del/s/q/f jdev\myprojects\oracle\apps\fnd\framework\toolbox\tutorial\test\PurchaseOrderServiceTest.java >nul 2>&1

        rename jdev\myprojects\Tutorial_customer.jpx           Tutorial.jpx
        rename jdev\myprojects\LabSolutions_customer.jpx       LabSolutions.jpx
        rename jdev\myprojects\ExtendLabSolutions_customer.jpx ExtendLabSolutions.jpx
        rename jdev\myprojects\SampleLibrary_customer.jpx      SampleLibrary.jpx

        mkdir jdev\dbc_files\secure
      )

      if /i "%4" NEQ "no_fwktoolbox_zip" (
        call :SsGetUtil jdev\dependencies\dbg %3 false $/%1/dependencies/dbg/*.*
        pushd jdev
          call :compileTutorialFiles %4 dependencies\dbg
          pushd myclasses
            rmdir/s/q oracle
            %JAR% cf0 ..\..\..\fwkToolbox.zip *
          popd
        popd
      )
    )

    if /i "%0" EQU ":bldbsolabsolutions" (
      echo .
      echo Creating BSOLabSolutions .....
      call :SsGetUtil jdev\myprojects                                                   %3 false $/%1/myprojects/BSOLabSolutions.jp* $/%1/myprojects/BSOLabSolutions.jws
      call :SsGetUtil jdev\myprojects\oracle\apps\fnd\framework\svctoolbox\labsolutions %3 true  $/%1/myprojects/oracle/apps/fnd/framework/svctoolbox/labsolutions/*.*

      attrib -R jdev\myprojects\*.jpx

      set zipName=BSOLabSolutions
      
      mkdir jdev\dbc_files\secure
      
     )

    if /i "%0" EQU ":bldbsoreferenceapp" (
      echo .
      echo Creating BSOReferenceApp .....
      call :SsGetUtil jdev\myprojects                                                   %3 false $/%1/myprojects/BSOReferenceApp.jp* $/%1/myprojects/BSOReferenceApp.jws
      call :SsGetUtil jdev\myprojects\oracle\apps\fnd\framework\svctoolbox\tutorial     %3 true  $/%1/myprojects/oracle/apps/fnd/framework/svctoolbox/tutorial/*.*
      call :SsGetUtil jdev\myprojects\oracle\apps\fnd\framework\svctoolbox\schema       %3 true  $/%1/myprojects/oracle/apps/fnd/framework/svctoolbox/schema/*.*

      attrib -R jdev\myprojects\*.jpx

      set zipName=BSOReferenceApp
      
      mkdir jdev\dbc_files\secure

    )    
    
    
    if /i "%0" EQU ":bldreqdemo" (
      echo .
      echo Creating ReqDemo .....
      call :SsGetUtil jdev\myhtml\OA_HTML                               %3 false $/%1/myhtml/OA_HTML/test.jsp $/%1/myhtml/OA_HTML/CustomizationTest.jsp
      call :SsGetUtil jdev\myprojects                                   %3 false $/%1/myprojects/wsp.jws $/%1/myprojects/ReqDemo.jpr
      call :SsGetUtil jdev\myprojects\oracle\apps\po\requisition\webui  %3 true  $/%1/myprojects/oracle/apps/po/requisition/webui/RequisitionOrder*CO.java $/%1/myprojects/oracle/apps/po/requisition/webui/RequisitionResult*CO.java $/%1/myprojects/oracle/apps/po/requisition/webui/RequisitionSearch*CO.java $/%1/myprojects/oracle/apps/po/requisition/webui/RequisitionSort*CO.java
      call :SsGetUtil jdev\myprojects\oracle\apps\po\requisition\server %3 true  $/%1/myprojects/oracle/apps/po/requisition/server/*.*
      call :SsGetUtil jdev\myprojects\oracle\apps\po\requisition\test   %3 true  $/%1/myprojects/oracle/apps/po/requisition/test/*.*
      call :SsGetUtil jdev\myprojects\oracle\apps\po\supplier           %3 true  $/%1/myprojects/oracle/apps/po/supplier/*.*
      call :SsGetUtil jdev\myprojects\oracle\apps\po\utilities          %3 true  $/%1/myprojects/oracle/apps/po/utilities/*.*
      set zipName=ReqDemo
    )
    if /i "%4" EQU "no_fwktoolbox_zip" %JAR% cfM ..\%zipName%.zip *
  popd

  rmdir/s/q BldTutorialWrkDir

  if /i "%4" EQU "no_fwktoolbox_zip" (
    if "%5" NEQ "" (
      echo.
      %DASH% Moving %zipName%.zip ...
      call :XcopyDelete %zipName%.zip   %5
    )
    %DASH% created %zipName%.zip
  ) else (
    if /i "%0" EQU ":bldtutorial" (
      if "%5" NEQ "" (
        echo.
        %DASH% Moving fwkToolbox.zip ...
        call :XcopyDelete fwkToolbox.zip %5
      )
      %DASH% created fwkToolbox.zip
    )
  )

  call :printBanner End %0
goto :EOF

::************* [private] CompileTutorialFiles - Builds Tutorial classes
:CompileTutorialFiles
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Builds Tutorial classes
  call :docParameters
  %doc%   1 = Location of Jdev installation (ie %NT_BLD%\jdev, %J_NT%\Jdev_57g_m36, etc.)
  %doc%   2 = Location of upstream provider zip files (ie dependencies\dbg, dependecies\opt, etc.)
  call :docExample %NT_BLD%\jdev dependencies\dbg
  %docEOF%

  set dbgFlag=-g

  set jdevIDE=%1
  echo -----------------------------------------------------------------------
  call :getOpenDriveLetter
  set drvLtr=%RET%
  subst %drvLtr% %jdevIDE%
  call :GetIdeVersion %1
  set IdeVersion=%RET%
  if /i "%IdeVersion%" EQU "1013" (
  set Apps=%drvLtr%\jdev\appslibrt\ojdbc14.jar;%drvLtr%\jdev\appslibrt\atg.zip;%drvLtr%\jdev\appslibrt\collections.zip;%drvLtr%\jdev\appslibrt\fwk.zip;%drvLtr%\jdev\appslibrt\fwkjbo.zip
  ) else (
  set Apps=%drvLtr%\jdev\appslibrt\ojdbc14.jar;%drvLtr%\jdev\appslibrt\aolj.jar;%drvLtr%\jdev\appslibrt\collections.zip;%drvLtr%\jdev\appslibrt\jttComn.zip;%drvLtr%\jdev\appslibrt\fwk.zip;%drvLtr%\jdev\appslibrt\fwkjbo.zip
  )
  set Uix=%drvLtr%\jdev\appslibrt\uix2.jar;%drvLtr%\jdev\appslibrt\share.jar
  set Bc4j=%drvLtr%\BC4J\lib\bc4jmt.jar;%drvLtr%\BC4J\lib\bc4jdomorcl.jar;%drvLtr%\BC4J\lib\bc4jcmp.jar
  set Svc=%drvLtr%\jdev\appslibrt\svc.zip
  set CLASSPATH=%drvLtr%\jdk\jre\lib\rt.jar;%Apps%;%Uix%;%Bc4j%;%Svc%
  echo CLASSPATH=%CLASSPATH%
  echo -----------------------------------------------------------------------

  set compileCmd=%jdevIDE%\jdev\bin\ojc -recurse -encoding Cp1252 %dbgFlag% -nowarn -d myclasses -sourcepath myprojects myprojects\*.java
  echo %compileCmd%
  %compileCmd%
  if "%errorlevel%" EQU "1" echo Compilation error encountered in %0 >> ..\error.log

  subst/d %drvLtr%

  xcopy/e/q/i myprojects\*.xml     myclasses\ 2>nul
  for /r myclasses /d %%i in (webui*) do if exist %%i\*.xml del/q/f %%i\*.xml 2>nul
goto :EOF

::************* [private] BldExtZip            - Builds EXT zip file
:BldExtZip
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Builds EXT zip file
  call :docParameters
  %doc%   1 = SS Branch. (ie jdev, jdev57H, etc.)
  %doc%   2 = Location of optimized Jdev zip file (ie X:\jt_rad\releases\9_0_3_8_3_510E\9.0.3.762\nondebug_jrad\jdev9033.zip)
  %doc%   3 = SS label name. Use LATEST if you want to get the latest out from SS  or if you have
  %doc%       the build label for this EXT release use that.
  %doc%   ----- optional parameter(s) -----
  %doc%   4 = Output location (ie d:\work, c:\x\[date], etc.). Default is your current directory.
  call :docExample jdev X:\jt_rad\releases\9_0_3_8_3_510E\9.0.3.762\nondebug_jrad\jdev9033.zip 90388_1032 d:\tmp
  %docEOF%

  call :printBanner Start %0 [%*]. Creating jdevExt.zip file ...

  call :blank BldExtZipWrkDir\jdevhome BldExtZipWrkDir\jdevdoc BldExtZipWrkDir\jdevbin

  pushd BldExtZipWrkDir
    %DASH% Creating EXT jdevhome directory ...
    pushd jdevhome
      call :BldTutorial %1 opt %3 no_fwktoolbox_zip
      rename Tutorial_customer.zip Tutorial.zip
      %JAR% xf Tutorial.zip
      call :XcopyDelete Tutorial.zip ..\jdevbin
    popd

    %DASH% Creating EXT jdevbin directory ...
    pushd jdevbin
      %JAR% xf %2
    popd

    %DASH% Creating EXT javadoc directory ...
    pushd jdevdoc
      call :ssget $/%1/dependencies/doc/jdevdoc.zip %3 false
      %JAR% xf jdevdoc.zip
    popd

    %DASH% Adding OAEXT_README.txt
    call :ssget $/%1/OAEXT_README.txt %3 false

    %DASH% Creating jdevExt.zip ...
    %JAR% cfM ..\jdevExt.zip *
  popd

  rmdir/s/q BldExtZipWrkDir

  if "%4" NEQ "" (
    echo.
    %DASH% Moving jdevExt.zip ...
    call :XcopyDelete jdevExt.zip  %4
  )

  call :printBanner End %0. Created jdevExt.zip.
goto :EOF

::************* [private] BldMyhtml            - Builds Myhtml.zip
:BldMyhtml
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Builds Myhtml.zip
  call :docParameters
  %doc%   1 = Location of Cabo images (ie h:\jdevhome\jdev)
  %doc%   2 = SS Branch. (ie jdev, jdev57H, etc.)
  %doc%   3 = Location of Jdev installation (ie %NT_BLD%\jdev, %J_NT%\Jdev_57g_m36, etc.)
  %doc%   4 = SS label name. Use LATEST if you want to get the latest out from SS.
  %doc%   ----- optional parameter(s) -----
  %doc%   5 = Output location (ie d:\work, c:\x\[date], etc.). Default is your current directory.
  call :docExample h:\jdevhome\jdev jdev %NT_BLD%\jdev latest c:\temp
  %docEOF%

  echo.
  call :printBanner Start %0 [%*]. Creating Myhtml.zip ...

  call :blank BldMyhtmlWrkDir
  pushd BldMyhtmlWrkDir
    call :SsGet $/%2/myhtml/*.* %4 true

    rmdir/s/q OA_MEDIA

    move OA_HTML html  >nul 2>&1

    echo.
    %DASH% Copying MMD files ...
    xcopy/q/i/f       %3\jdev\lib\ext\jrad\config\mmd\*.* html\jrad

    echo.
    %DASH% Copying UIX files to html\cabo ...
    %XCOPY%/e/q/i/c/f %1\myhtml\OA_HTML\cabo         html\cabo

    echo.
    %DASH% Copying media files ...
    mkdir media
    xcopy/q %1\myhtml\OA_MEDIA\*.gif media
    mkdir   html\cabo\OAImages
    %MOVE% media\FNDEMAIL.gif   html\cabo\OAImages
    %MOVE% media\FNDFHELP.gif   html\cabo\OAImages
    %MOVE% media\FNDLOGOF.gif   html\cabo\OAImages
    %MOVE% media\FNDPORTL.gif   html\cabo\OAImages
    %MOVE% media\FNDPREFS.gif   html\cabo\OAImages
    %MOVE% media\showlog.gif    html\cabo\OAImages
    %MOVE% media\*greyscale.gif html\cabo\OAImages >nul

    if not exist html\cabo\images mkdir html\cabo\images

    call :getRegionXmlFiles mds %2 %4

    call :SsGetUtil mds\oracle\apps\fnd\framework\toolbox %4 true $/%2/myprojects/oracle/apps/fnd/framework/toolbox/*.xml

    del/s/q/f *.scc  >nul 2>&1

    call :createOaVersionFile %4 oa_version.txt %3

    %JAR% cfM ..\Myhtml.zip  *
  popd

  rmdir/s/q BldMyhtmlWrkDir

  if "%5" NEQ "" call :XcopyDelete Myhtml.zip  %5

  echo.
  call :printBanner End %0. Created Myhtml.zip

goto :EOF

::************* [private] BldFwkDoc            - Builds oafjavadoc*.jar or a directory of javadoc files
:BldFwkDoc
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Builds oafjavadoc*.jar or a directory of javadoc files.
  %doc%.
  %doc% NOTE: If parameter 6 is set to true, this routine uses rsh to ap814sun.
  %doc%       In order to use this routine, your PC must be registered in /etc/hosts
  %doc%       and /etc/hosts.equiv on ap814sun.
  call :docParameters
  %doc%   1 = SS Branch. (ie jdev, jdev57H, etc.)
  %doc%   2 = Location of Jdev installation (ie %NT_BLD%\jdev, %J_NT%\Jdev_57g_m36, etc.)
  %doc%   3 = SS label name. Use LATEST if you want to get the latest out from SS.
  %doc%   4 = Options. (jar or files)
  %doc%   5 = Generate javadoc for private, internal, or public (private, internal, or public)
  %doc%   6 = dbg or opt (dbg=build javadoc w/ daily_bld_numbers or opt=build javadoc w/out daily_bld_numbers)
  %doc%   ----- optional parameter(s) -----
  %doc%   7 = Output location (ie d:\work, c:\x\[date], etc.). Default is your current directory.
  call :docExample jdev %NT_BLD%\jdev latest files internal dbg c:\temp
  %docEOF%

  echo.
  call :printBanner Start %0 [%*]. Creating %5 javadoc ...

  set outputLocation=doc

  if "%7" NEQ "" (
    set outputLocation=%7\doc
  )

  set scope=protected
  if /i "%5" EQU "private"  set scope=package

  if /i "%4" EQU "jar" (
    set jarFileName=oafjavadoc_%5.jar
    set copyMsg=Copying oafjavadoc%5.jar to %outputLocation% ...
    set finalMsg=Created %outputLocation%\oafjavadoc%5.jar
  ) else (
    set copyMsg=Copying javadoc files to %outputLocation% ...
    set finalMsg=Created javadoc files in %outputLocation%
  )

  call :blank javadocTmp javadocTmp\fwk javadocTmp\fwk\%5

  :: %NT_BLD%\jdev\jdev\doc\ohj\oafjavadoc.jar!\fwk
  :: Extract all oracle.apps.fnd.* java files from SS into javadoc_tmp_wrk_area
  pushd javadocTmp

    :: In 1013, ST changed the extension of uix2-javadoc.jar to uix2-javadoc.zip.
    :: Thus, we need to make that distinction here and load the right
    :: file name into the variable uix_file.
    call :GetIdeVersion %2
    set IdeVersion=%RET%
    set uix_file=uix2-javadoc.jar
    if /i "%IdeVersion%" EQU "1013" set uix_file=uix2-javadoc.zip

    call :getUpstreamJavadoc uix  %2\jdev\doc\ohj                 %uix_file%
    call :getUpstreamJavadoc bc4j %2\jdev\doc\ohj                 bc4jjavadoc.jar
    call :getUpstreamJavadoc aolj %NT_BLD%\doc\%1\aolj            aoljDoc.zip

    call :SsGetUtil tmp %3 true $/%1/myprojects/oracle/*.java

    pushd tmp
                                findstr/sim "javadoc_public"    *.java >  ..\x.x
      if /i "%5" EQU "internal" findstr/sim "javadoc_internal"  *.java >> ..\x.x
      if /i "%5" EQU "private"  findstr/sim "javadoc_internal"  *.java >> ..\x.x
      if /i "%5" EQU "private"  findstr/sim "javadoc_private"   *.java >> ..\x.x
    popd

    for /f %%i in (x.x) do xcopy/q/y tmp\%%i oracle\%%i*  >nul 2>&1

    del/q x.x

    rmdir/s/q tmp
    if /i "%5" EQU "public" rmdir/s/q oracle\svc

    echo.
    %DASH% Get package.xml from SS ...
    call :SsGetUtil oracle           %3 true  $/%1/myprojects/oracle/package*.html
    call :SsGetUtil dependencies\dbg %3 false $/%1/dependencies/dbg
    xcopy/s/q/y %NT_BLD%\ARCS\%1\3rdparty\*.* dependencies\dbg
    rmdir/s/q oracle\apps\fnd\framework\webui\templates

    :: build pkg list - Make sure to include only .java files in this listing
    dir/s/b oracle\*.java > pkg.lis

    :: Setup Classpath
    call :getOpenDriveLetter
    set openDriveLetter=%ret%
    set gotClassPath=N
    call :setupClassPath %2 javadoc %openDriveLetter% Y

    set appendClassPath=
    if exist %openDriveLetter%\jdev\appslibrt\fwk.zip    set appendClassPath=;%openDriveLetter%\jdev\appslibrt\fwk.zip
    if exist %openDriveLetter%\jdev\appslibrt\fwkjbo.zip set appendClassPath=%appendClassPath%;%openDriveLetter%\jdev\appslibrt\fwkjbo.zip
    if exist %openDriveLetter%\jdev\appslibrt\svc.zip    set appendClassPath=%appendClassPath%;%openDriveLetter%\jdev\appslibrt\svc.zip
   
    call :getOpenDriveLetter
    set TempDrvForAppendClassPath=%RET%
    if "%appendClassPath%" EQU "" (
    :: Hack to get around 2048 character limit when calling set classpath
    subst %TempDrvForAppendClassPath% %7
    rem  if exist %7\dbg\fwk.zip    set appendClassPath=;%7\dbg\fwk.zip
    rem  if exist %7\dbg\fwkjbo.zip set appendClassPath=%appendClassPath%;%7\dbg\fwkjbo.zip
    rem  if exist %7\dbg\svc.zip    set appendClassPath=%appendClassPath%;%7\dbg\svc.zip
    set appendClassPath=%appendClassPath%;%TempDrvForAppendClassPath%\dbg\fwk.zip;%TempDrvForAppendClassPath%\dbg\fwkjbo.zip;%TempDrvForAppendClassPath%\dbg\svc.zip
    )

    set classpath=%classpath%;%appendClassPath%
    echo.
    echo -----------------------------------------------------------------------
    echo AppendClassPath=%appendClassPath%
    echo -----------------------------------------------------------------------
    echo -----------------------------------------------------------------------
    echo ClassPath=%classpath%
    echo -----------------------------------------------------------------------
    echo ----------------------------------------------------------------------
    echo Generating javadoc for %5 ...
    echo ----------------------------------------------------------------------
::    %JAVADOC% -protected -encoding Cp1252 -charset ISO-8859-1 -docencoding Cp1252 -linkoffline http://java.sun.com/j2se/1.3/docs/api %NT_BLD%\doc\j2se -linkoffline http://java.sun.com/j2ee/sdk_1.3/techdocs/api %NT_BLD%\doc\j2ee_techdoc -link http://bali.us.oracle.com/cabo/specs/cabo21 -link http://www-apps.us.oracle.com/atg/java/aolj/javadoc_ruph1 -link http://www-apps.us.oracle.com/fwk/javadoc/57/bc4j9i -link http://www-apps.us.oracle.com/fwk/javadoc/58/doc -doctitle "OA Framework v. 11.5.10" -windowtitle "OA Framework v. 11.5.10" -bottom "<a href="http://www-apps.us.oracle.com/fwk/javadoc/copyright.htm">Copyright &#169; 2003, Oracle. All rights reserved.</a>" -d fwk @pkg.lis

    set tmpDocTitle=OA Framework v. %RELEASE% (%3)
    if /i "%6" EQU "opt"  set tmpDocTitle=OA Framework v. %RELEASE%
    %JAVADOC% -J-Xmx256m -%scope% -encoding Cp1252 -charset ISO-8859-1 -docencoding Cp1252 -linkoffline http://java.sun.com/j2se/1.5.0/docs/api %NT_BLD%\doc\j2se -linkoffline http://java.sun.com/j2ee/sdk_1.3/techdocs/api %NT_BLD%\doc\j2ee_techdoc -link uix -link aolj -link bc4j -doctitle "%tmpDocTitle%" -windowtitle "OA Framework v. %RELEASE% (%3)" -bottom "<a href="http://www-apps.us.oracle.com/fwk/javadoc/copyright.htm">Copyright &#169; 2006, Oracle. All rights reserved.</a>" -d fwk\%5 @pkg.lis
    echo.
    echo ----------------------------------------------------------------------
    echo Finished generating %5 javadoc
    echo ----------------------------------------------------------------------

    subst/d %openDriveLetter%
    subst/d %TempDrvForAppendClassPath%

    :: Cleanup everything except for the fwk directory
    rmdir/s/q oracle dependencies uix aolj bc4j
    del/q/f *.lis 2>nul

    pushd fwk\%5
      if /i "%4" EQU "jar" %JAR% cfM ..\..\..\%jarFileName% *
    popd
  popd

  echo.
  %DASH% %copyMsg%
  if /i "%4" EQU "jar" (
    call :XcopyDelete %jarFileName%  %outputLocation%
  ) else (
    call :blank %outputLocation%
    xcopy/q/e/y javadocTmp\fwk\%5\* %outputLocation%\
  )

  rmdir/s/q javadocTmp

  echo.
  call :printBanner End %0. %finalMsg%

goto :EOF

::************* [private] getUpstreamJavadoc   - Gets the upstream javadoc files
:getUpstreamJavadoc
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Gets the upstream javadoc files
  call :docParameters
  %doc%   1 = Upstream application (uix, bc4j, aolj, etc)
  %doc%   2 = Location of where javadoc directory or zip/jar files are located
  %doc%   ----- optional parameter(s) -----
  %doc%   3 = Zip or Jar file name to be unzipped. If blank, then assume Paramenter 2 is a directory.
  %doc%       Thus, the contents of the directory needs to be copied.
  call :docExample %NT_BLD%\jdev_90384_794\jdev\doc\ohj uix2-javadoc.jar
  %docEOF%

  call :blank %1

  %DASH% Getting upstream javadoc %2\%3 ...

  if "%3" NEQ "" (
    xcopy/s/q/y %2\%3 %1\ >nul
    pushd %1
      %JAR% xf %3
      if /i "%1" EQU "bc4j" (
        if exist rt (
          move rt\* . >nul
          move rt\oracle .
          rmdir/s/q rt
        )
      )
    popd
  ) else (
    xcopy/s/q/y %2\* %1\ >nul
  )

goto :EOF

::************* [public]  InstallJdev          - Installs/Publishes a Jdev installation to the division
::************* [public]  UninstallJdev        - Uninstalls/Removes a division Jdev installation
:InstallJdev
:UninstallJDev
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  if /i "%0" EQU ":installjdev"   %doc% Installs/Publishes a Jdev installation to the division
  if /i "%0" EQU ":uninstalljdev" %doc% Uninstalls/Removes a Jdev installation
  %doc%.
  %doc% NOTE: This routine uses rsh to ap814sun. In order to use this routine, your
  %doc%       PC must be registered in /etc/hosts and /etc/hosts.equiv on ap814sun.
  call :docParameters
  %doc%   CAUTION: Parameters for this routine are case sensitive
  %doc%   1 = Destination directory, relative to %J_UNX%/NT (Example: 57_v3_2974670)
  if /i "%0" EQU ":installjdev"   %doc%   2 = Source directory, relative to %UNX_BLD% (Example: jdev_90363_389)
  if /i "%0" EQU ":installjdev"   %doc%   3 = Javadoc area, relative to %J_UNX%/javadoc (Example: 510)
  if /i "%0" EQU ":installjdev"   call :docExample 57_v3_2974670 jdev_90363_389 120
  if /i "%0" EQU ":uninstalljdev" call :docExample 57_v3_2974670
  %docEOF%

  call :printBanner Start %0 [%*]

  set shortCut=%1.lnk

  :: Do common tasks regardless of install or uninstall.
  del/f/q %J%\%shortCut%           >nul 2>&1
  del/f/q %J_NT%\RSYNCH\%shortCut% >nul 2>&1
  del/f/q %J_NT%\%1\%shortCut%     >nul 2>&1

  :: Publish Jdeveloper to the division
  if /i "%0" EQU ":installjdev" (
    call :unix %UNX_BLD%/build publicArea install %1 %2 %3
    if exist %J_NT%\%1\jdev\bin\jdevw.exe (
      call :CreateShortCut %J%\%shortCut% %J_NT%\%1\jdev\bin\jdevw.exe
      %XCOPY%/q/r %J%\%shortCut% %J_NT%\%1\      >nul
      %XCOPY%/q/r %J%\%shortCut% %J_NT%\RSYNCH\  >nul
      echo "Copying to D:\"
      %XCOPY%/s/e/i %J_NT%\%1  %D_NT%\%1
    )
  ) else (
    call :unix %UNX_BLD%/build publicArea uninstall %1
  )

  call :printBanner End %0
goto :EOF

::************* [public]  InstallJdevExt       - Installs/Publishes a EXT Jdev installation to the division
::************* [public]  UninstallJdevExt     - Uninstalls/Removes a division EXT Jdev installation
:InstallJdevExt
:UninstallJDevExt
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  if /i "%0" EQU ":installJdevExt"   %doc% Installs/Publishes a EXT Jdev installation to the division
  if /i "%0" EQU ":uninstallJdevExt" %doc% Uninstalls/Removes a EXT Jdev installation
  %doc%.
  %doc% NOTE: This routine uses rsh to ap814sun. In order to use this routine, your
  %doc%       PC must be registered in /etc/hosts and /etc/hosts.equiv on ap814sun.
  call :docParameters
  %doc%   CAUTION: Parameters for this routine are case sensitive
  %doc%   1 = Unix location of jdevbin/ext (Usually %J_UNX%/ext)
  %doc%   2 = Destination directory, relative to parameter 1 (Example: 510_rup4_342456)
  if /i "%0" EQU ":installJdevExt"   %doc%   3 = SS Branch (Example: jdev, jdev11510rup4, etc)
  if /i "%0" EQU ":installJdevExt"   %doc%   4 = Unix location of jdevExt.zip (Example: %J_UNX%/ext/FWK/jdev11510rup4_903813_1550_4/jdevExt.zip). Use BldExtZip to build jdevExt.zip.
  if /i "%0" EQU ":installJdevExt"   call :docExample %J_UNX%/ext 510_rup4_342456 jdev11510rup4 %J_UNX%/ext/FWK/jdev11510rup4_903813_1550_4/jdevExt.zip
  if /i "%0" EQU ":uninstallJdevExt" call :docExample %J_UNX%/ext 510_rup4_342456
  %docEOF%

  call :printBanner Start %0 [%*]

  :: Publish Jdeveloper to the division
  if /i "%0" EQU ":installJdevExt"   set option=install
  if /i "%0" EQU ":UninstallJdevExt" set option=uninstall

  set lnk=%3

  call :unix %UNX_BLD%/build publicExtArea %option% %1 %2 %lnk% %4

  %XCOPY%/s/e/i %UNX_EXT%\%1  %D_EXT%\%1  >nul
  
  call :printBanner End %0.
goto :EOF

::************* [public]  ApplyLabel           - Applies a SourceSafe label and stripes all dependent files
:ApplyLabel
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Applies a SourceSafe label and stripes all dependent files
  call :docParameters
  %doc%   1 = SS Branch. (ie jdev, jdev57H, etc.)
  %doc%   ----- optional parameter(s) -----
  %doc%   2 = Label Name to be applied to non-source controlled files as well as SS files (eg: 90363_399)
  %doc%        If no label is specified then a date/time stamp will be used.
  call :docExample jdev 90363_399
  %docEOF%

  set label=%2
  if "%2" EQU ""  set label=%dateTime%

  :: Apply label to SS
  %SS% label $/%1 -I-Y -L%label% 2>nul

  :: We no longer need to do this because $/doc specific folders have been moved to $/jdev
::  if /i "%1" EQU "jdev"     %SS% label $/doc -I-Y -L%label% 2>nul
::  if /i "%1" EQU "jdev510"  %SS% label $/doc -I-Y -L%label% 2>nul

  echo.
  %DASH% Label (%label%) applied to SourceSafe project ($/%1)
goto :EOF

::************* [private] CreateBackup         - Create a _backup# directory
:createBackup
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Create a _backup# directory
  call :docParameters
  %doc%   1 = Directory to backup (Example: %NT_BLD%)
  %doc%   2 = Location to backup relative to %NT_BLD% (Example: jdev_4pm)
  %doc%   3 = Maximum number of backup directories to create (Example: 2)
  call :docExample %NT_BLD% jdev_4pm 1
  %docEOF%

  for /l %%v in (%3, -1, 1) do call :performBackup %1 %2 %%v
goto :EOF

::************* [private] PerformBackup        - Create a _backup# directory
:performBackup
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Create a _backup# directory
  call :docParameters
  %doc%   1 = Top Directory (Example: %NT_BLD%)
  %doc%   2 = Backup Directory (Example: jdev_4pm)
  %doc%   3 = Backup copy number
  call :docExample %NT_BLD% jdev_4pm 1
  %docEOF%

  setlocal
  set /a previous=%3-1
  set currDir=%1\%2
  set backup=%2_backup%3
  set currBackup=%currDir%_backup%3
  set prevBackup=%currDir%_backup%previous%

  if exist %currBackup%               rmdir/s/q %currBackup%
  if exist %prevBackup%               rename    %prevBackup% %backup%
  if "%3" EQU "1" if exist %currDir%  rename    %currDir%    %backup%
  endlocal
goto :EOF

::************* [private] CreateShortCut       - Creates a windows shortcut (uses VB script)
:createShortCut
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Creates a windows shortcut (uses VB script)
  call :docParameters
  %doc%   1 = Windows shortcut name (Example: %J%\510_c_3061106.lnk)
  %doc%   2 = Target location of exe (Example: %J_NT%\510_c_3061106\jdev\bin\jdevw.exe)
  call :docExample %J%\510_c_3061106.lnk %J_NT%\510_c_3061106\jdev\bin\jdevw.exe
  %docEOF%

  call :printBanner Start %0 [%*]

  echo Dim oShell, oSC, OURL                                               > bogus.vbs
  echo Set oShell      = CreateObject("Wscript.Shell")                    >> bogus.vbs
  echo Set oSC         = oShell.CreateShortcut(Wscript.Arguments(0))      >> bogus.vbs
  echo oSC.TargetPath  = Wscript.Arguments(1)                             >> bogus.vbs
  echo oSC.Save                                                           >> bogus.vbs

  bogus.vbs %1 %2

  del/q bogus.vbs

  call :printBanner End %0
goto :EOF

::************* [private] XcopyDelete          - Moves a file
:XcopyDelete
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Copy a file then delete it from its original location (similar to move)
  call :docParameters
  %doc%   1 = filename fwk.zip
  %doc%   2 = Destination c:\x
  call :docExample fwk.zip C:\temp
  %docEOF%

  if exist %1 (
      %XCOPY%/f %1 %2\
      del/f %1
  )
goto :EOF

::************* [private] XcopyFiles           - Copy a list of directories from one location to another
:XcopyFiles
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Copy a list of directories from one location to another. Does NOT move files.
  call :docParameters
  %doc%   1 = Location of files (ie d:\xyz)
  %doc%   2 = Destination (ie myprojects)
  %doc%   3 to N = dir specs
  call :docExample d:\work\jdev jdev myprojects myhtml
  %docEOF%

  :getDirLoop
      xcopy/e/q/i %1\%3 %2\%3  >nul 2>&1
      shift /3
      if /i "%3" NEQ "" goto :getDirLoop
goto :EOF

::************* [private] ZipIt                - Create *.zip (.class) and *Src.zip (.java)
:ZipIt
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Create *.zip (.class) and *Src.zip (.java)
  call :docParameters
  %doc%   1 = name of zip file (ie fwk, fwkjbo, or req)
  %doc%   2 = Location of Jdev installation (ie %NT_BLD%\jdev, %J_NT%\Jdev_57g_m36, etc.)
  %doc%   3 = SS label name. Use LATEST if you want to get the latest out from SS.
  %doc%   4 to N = Packages (ie oracle/apps/fnd)
  call :docExample fwk %NT_BLD%\jdev latest oracle/apps/fnd
  %docEOF%

  echo.
  call :printBanner Start %0 [%*]. Creating %1.zip and %1Src.zip ...

  call :blank ZipItWrkDir

  pushd ZipItWrkDir
    :getNxtPkg
      call :xcopyFiles ..\myprojects myprojects %4
      call :xcopyFiles ..\myclasses  myclasses  %4
      shift /4
      if /i "%4" NEQ "" goto :getNxtPkg

    pushd myprojects
      call :createOaVersionFile %3 oa_version.txt %2
      %JAR% cfM ..\..\..\%1Src.zip  oa_version.txt oracle
    popd

    pushd myclasses
      call :createOaVersionFile %3 oa_version.txt %2
      %JAR% cf0 ..\..\..\%1.zip     oa_version.txt oracle
    popd
  popd

  rmdir/s/q ZipItWrkDir

  echo.
  call :printBanner End %0. Created %1.zip and %1Src.zip.

goto :EOF

::************* [private] CreateOaVersionFile  - Create an OA_VERSION.TXT file
:createOaVersionFile
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Create an OA_VERSION.TXT file
  call :docParameters
  %doc%   1 = SS label name. Use LATEST if you want to get the latest out from SS.
  %doc%   2 = File name (ie jdev\oa_version.txt, oa_version.txt, etc.)
  %doc%   ----- optional parameter(s) -----
  %doc%   3 = Location of Jdev installation (ie %NT_BLD%\jdev, %J_NT%\Jdev_57g_m36, etc.). Required ONLY if param1 == latest.
  call :docExample latest oa_version.txt %NT_BLD%\jdev
  %docEOF%

  if /i "%1" EQU "LATEST" (
    call :getOaVersion %2 %3
  ) else (
    echo %1 > %2
  )
goto :EOF

::************* [private] GetOaVersion         - Extracts out an OA_VERSION.TXT file from fwk.zip
:GetOaVersion
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Extracts out an OA_VERSION.TXT file from fwk.zip
  call :docParameters
  %doc%   1 = File name (ie jdev\oa_version.txt, oa_version.txt, etc.)
  %doc%   2 = Location of Jdev installation (ie %NT_BLD%\jdev, %J_NT%\Jdev_57g_m36, etc.)
  call :docExample jdev\oa_version.txt %NT_BLD%\jdev
  %docEOF%

  call :blank GetOaVersionWrkDir

  pushd GetOaVersionWrkDir
    %JAR% xf %2\jdev\appslibrt\fwk.zip oa_version.txt
  popd

  %MOVE% GetOaVersionWrkDir\oa_version.txt %1
  rmdir/s/q GetOaVersionWrkDir
goto :EOF

::************* [private] CompileIt            - Compile java files in a set of directories
:CompileIt
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Compile java files in a set of directories
  call :docParameters
  %doc%   1 = Location of source ... aka JavaTop (ie myprojects)
  %doc%   2 = Output location of where classes should go (ie myclasses)
  %doc%   3 = Encoding parameter (ie ISO8859_1)
  %doc%   4 = Directory spec to compile. Relative to parameter 1. (ie orace/apps/fnd, etc.)
  %doc%   5 = dbg or opt (dbg=build dbg zips or opt=build optimized zips)
  %doc%   6 = Location of Jdev installation (ie %NT_BLD%\jdev, %J_NT%\Jdev_57g_m36, etc.)
  %doc%   7 = Temporary Drive Letter (ie I:, H:, etc)
  call :docExample myprojects myclasses ISO8859_1 oracle/apps/fnd/framework dbg %NT_BLD%\jdev I:
  %docEOF%

  ::Usage: javac <options> <source files>
  ::
  ::where <options> includes:
  ::  -g                     Generate all debugging info
  ::  -g:none                Generate no debugging info
  ::  -g:{lines,vars,source} Generate only some debugging info
  ::  -O                     Optimize; may hinder debugging or enlarge class files
  ::  -nowarn                Generate no warnings
  ::  -verbose               Output messages about what the compiler is doing
  ::  -deprecation           Output source locations where deprecated APIs are used
  ::  -classpath <path>      Specify where to find user class files
  ::  -sourcepath <path>     Specify where to find input source files
  ::  -bootclasspath <path>  Override location of bootstrap class files
  ::  -extdirs <dirs>        Override location of installed extensions
  ::  -d <directory>         Specify where to place generated class files
  ::  -encoding <encoding>   Specify character encoding used by source files
  ::  -target <release>      Generate class files for specific VM version

  :: Usage: ojc [-bootclasspath pathlist]
  ::            [-classpath pathlist]
  ::            [-d dir]
  ::            [-deprecation[:self]]
  ::            [-encoding name]
  ::            [-exclude classname]
  ::            [-extdirs pathlist]
  ::            [-g[{:none|:source,lines,vars,codecoach}]]
  ::            [-help]
  ::            [--help]
  ::            [-make make-dep-file]
  ::            [-msglimit:#]
  ::            [-noquiet]
  ::            [-nowarn[:#]]
  ::            [-nowrite]
  ::            [-obfuscate]
  ::            [-rebuild]
  ::            [-recurse [level]]
  ::            [-rx dirs]
  ::            [-source {1.3|1.4}]
  ::            [-sourcepath pathlist]
  ::            [-strictfp]
  ::            [-sysclasspath pathlist]
  ::            [-target {1.1|1.2|1.3|1.4}]
  ::            [-updateimports[{:none|:class|:jar}]]
  ::            [-verbose]
  ::            [-verbosepath]
  ::            [-warn[:#]]
  ::            [-warningtag tags] { -p {package}+ | -s {source.java}+ | {file.java}+ }
  ::
  ::   -classpath pathlist     semicolon separated list of paths used to locate
  ::                           required .class files
  ::   -sourcepath pathlist    semicolon separated list of paths used to locate
  ::                           required .java files
  ::   -sysclasspath pathlist  semicolon separated list of paths used to locate
  ::                           system .class files
  ::   -bootclasspath pathlist equivalent to -sysclasspath
  ::   -d outdir               output root directory for generated '.class' files
  ::   -deprecation            display deprecation warning messages
  ::   -deprecation:self       also display deprecation warning messages found in
  ::                           sources currently being compiled
  ::   -encoding name          character encoding 'name' to use for reading source
  ::                           files
  ::   -exclude classname(s)   will eliminate all calls to static void methods of
  ::                           the specified class(es), use semicolon separated list
  ::                           to specify more than one class (e.g. p1.c1;p2.c2)
  ::   -extdirs pathlist       semicolon separated list of paths to be added to the
  ::                           classpath, all .jar files in each path will be added
  ::   -g                      generates debugging information
  ::   -g:none                 no debugging information
  ::   -g:source,lines,vars,codecoach
  ::                           selective debugging information, any of them may be
  ::                           omitted
  ::   -help  or  --help       print this help
  ::   -make makedepfile       make specified source files with specified make
  ::                           dependency information file,
  ::                           used for minimal rebuild of all specified source
  ::                           files and their dependents, the specified filename
  ::                           will be created if not found
  ::   -msglimit:#             maximum number of errors/warnings to output
  ::                           -1 ==> nolimit, default is 1000
  ::   -noquiet                display filenames as they are compiled
  ::   -nowarn                 don't output any warning messages
  ::   -nowarn:#               don't output specified warning message number
  ::   -nowrite                perform compilation only, no output
  ::   -obfuscate              obfuscate all classes compiled
  ::   -p {package}+           make/rebuild all files in the space separated list of
  ::                           one or more package name
  ::   -prompt                 prompt for continue/abort after each syntax errors
  ::   -rebuild                rebuild specified sources files, if -make is
  ::                           not specified then rebuild is true by default
  ::   -recurse [level]        will recursively expand wildcard file specifications,
  ::                           and not recurse deeper than [level] (if specified)
  ::   -rx dirs                comma separated list of directory names to exclude
  ::                           while recursively searching for files
  ::   -s {source.java}+       make/rebuild space separated list of one or more
  ::                           source file
  ::   -source {1.3|1.4}       1.4 will enable assertions and other 1.4 features
  ::                           default is 1.3; when 1.4 is used, it set -target 1.4
  ::   -strictfp               enable strict floating point for all methods
  ::   -target {1.1|1.2|1.3|1.4}
  ::                           generate specified version number in .class,
  ::                           also uses different versions for standard libraries,
  ::                           use -verbosepath to see the sysclasspath value
  ::   -updateimports          update imported classes (if source is found on
  ::                           sourcepath), but not if .class is from .zip/.jar
  ::                           file (default setting)
  ::   -updateimports:class    same as -updateimports
  ::   -updateimports:jar      same as -updateimports, but will also update .class
  ::                           read from .zip/.jar file
  ::   -updateimports:none     don't update imported classes
  ::   -verbose                display compilation progress information
  ::   -verbosepath            display sourcepath and classpath values
  ::   -warn                   enable all warning messages (by default, all warnings
  ::                           are enabled except import related warnings [486,487])
  ::   -warn:#                 output specified warning message number
  ::   -warningtag tags        comma separated list of javadoc comment tags to
  ::                           warn on upon occurences in source comments
  ::                           (ex: /**@TODO*/  or //@TBD )

  call :setupClassPath %6 build %7 Y
  if /i "%5"=="opt" (
    set dbgFlag=-g:none -O
  ) else (
    set dbgFlag=-g
  )

  if exist %4\*.java (
    echo %6\jdev\bin\ojc %dbgFlag% -d %2 -encoding %3 -nowarn -classpath %ClassPath% -sourcepath %1 %4\*.java
    %6\jdev\bin\ojc %dbgFlag% -d %2 -encoding %3 -nowarn -classpath %ClassPath% -sourcepath %1 %4\*.java
    if "%errorlevel%" EQU "1" echo Error compiling package %4 >> ..\error.log
  )

goto :EOF

::************* [private] GetRegionXmlFiles    - Generate Region XML files for AK and FND
:getRegionXmlFiles
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Generate Region XML files for FND and AK
  call :docParameters
  %doc%   1 = output directory (ie mds, etc.)
  %doc%   2 = SS Branch. (ie jdev, jdev57H, etc.)
  %doc%   3 = SS label name. Use LATEST if you want to get the latest out from SS.
  %doc%   ----- optional parameter(s) -----
  %doc%   4 = Manifest filename (eg c:\tmp\fwkMds.txt)
  call :docExample mds jdev latest c:\tmp\fwkMds.txt
  %docEOF%

  echo.
  call :printBanner Start %0 [%*]. Getting Region XML files ...

  set tmp_out=%4
  if "%4" EQU ""  set tmp_out=nul

  call :blank GetRegionXmlFilesWrkDir\oracle\apps

  call :getRegionXmlFromSS GetRegionXmlFilesWrkDir\oracle\apps %2 %3

  xcopy/s GetRegionXmlFilesWrkDir %1\  >nul

  rmdir/s/q GetRegionXmlFilesWrkDir

  call :getLocalDir
  set localDir=%ret%\%1

  del/q/f %4 2>nul

  for /f "delims=%localDir% tokens=*" %%i in ('dir/s/b *.xml') do @echo %%i >> %tmp_out%

  echo.
  call :printBanner End %0. Created Region XML files from Source Safe
goto :EOF

::************* [private] GetRegionXmlFromSS   - Get Region XML files out from SourceSafe
:getRegionXmlFromSS
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Get Region XML files out from SourceSafe
  call :docParameters
  %doc%   1 = output directory (ie jdev\myprojects\oracle\apps, mds\oracle\apps, etc)
  %doc%   2 = SS Branch. (ie jdev, jdev57H, etc.)
  %doc%   3 = SS label name. Use LATEST if you want to get the latest out from SS.
  call :docExample jdev\myprojects\oracle\apps ak jdev latest
  %docEOF%

  call :printBanner Start %0 [%*]
  set xmlDir=%1

  :: Get the xml files based on the followng patterns:
  ::  oracle\apps\xx\regionMap.xml
  ::  oracle\apps\xx\attributesets\*.xml
  ::  oracle\apps\xx\...\webui\*.xml
  call :SsGetUtil %xmlDir%\ak\  %3 true $/%2/myprojects/oracle/apps/ak/*.xml
  call :SsGetUtil %xmlDir%\fnd\ %3 true $/%2/myprojects/oracle/apps/fnd/*.xml

  :: Exceptions delete framework\test and framework\toolbox
  %DASH% Deleting exception cases ...
  rmdir/s/q %xmlDir%\fnd\framework\test
  rmdir/s/q %xmlDir%\fnd\framework\toolbox

  :: Using a FOR loop, rip through all XML files and delete all items that
  :: don't have "webui", "attributesets", "regionMap.xml" and "migrationMap.xml" in it.
  %DASH% Deleting all Non-Region XML files ...
  for /r %xmlDir%\fnd %%i in (*.xml) do call :DelNonRgnXmlFiles %%i

  call :trimDir %xmlDir%

  call :printBanner End %0
::  tree/a /f
goto :EOF

::************* [private] TrimDir              - Iterates and terminates only after there are no more empty directories to delete
:TrimDir
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Iterates and terminates only after there are no more empty directories to delete.
  call :docParameters
  %doc%   1 = Directory Name
  call :docExample d:\tmp
  %docEOF%

  %DASH% Triming %1 ...

  :TrimDirLoop
    set keepGoing=NO
    for /r %1 %%a in (.) do @(dir/s/b %%a | findstr .> nul || (rmdir/s/q %%a & set keepGoing=YES))
    if "%keepGoing%" EQU "YES" goto :TrimDirLoop

goto :EOF


::************* [private] DelNonRgnXmlFiles    - Delete Non-Region XML files
:DelNonRgnXmlFiles
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Delete Non-Region XML files
  call :docParameters
  %doc%   1 = file name
  call :docExample bld_tmp_dir\oracle\apps\fnd\server\FndDocumentsShortTextEO.xml
  %docEOF%

  :: Delete all items that don't have "\webui\", "\attributesets\", "\regionMap.xml" and "\migrationMap.xml" in it.
  :: Find substring in a string
  echo %1 | find "\webui\"           /i > nul & if not errorlevel 1 goto :EOF
  echo %1 | find "\attributesets\"   /i > nul & if not errorlevel 1 goto :EOF
  echo %1 | find "\regionMap.xml"    /i > nul & if not errorlevel 1 goto :EOF
  echo %1 | find "\migrationMap.xml" /i > nul & if not errorlevel 1 goto :EOF

  :: Delete this file it has been determined that it is NOT a Region XML file.
  :: echo   Deleting %1
  del/f %1
goto :EOF

::************* [private] SsGetUtil            - Given a list of SourceSafe objects get them out from SourceSafe
:SsGetUtil
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Given a list of SourceSafe objects get them out from SourceSafe
  call :docParameters
  %doc%   1 = Output directory. This routine will create output directory if it doesn't exist.
  %doc%   2 = SS label name. Use LATEST if you want to get the latest out from SS.
  %doc%   3 = true or false. Recursive get?
  %doc%   4 to N = Name of SS object(s) to get
  call :docExample jdev\myprojects\oracle\apps\fnd latest true $/jdev/myprojects/oracle/apps/fnd
  %docEOF%

  if not exist %1  mkdir %1
  pushd %1
    :SsGetUtilLoop
      call :SsGet %4 %2 %3
      shift /4
      if /i "%4" NEQ "" goto :SsGetUtilLoop
  popd
goto :EOF

::************* [private] SsChkOutUtil         - Given a list of SourceSafe objects check them out from SourceSafe
:SsChkOutUtil
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Given a list of SourceSafe objects check them out from SourceSafe
  call :docParameters
  %doc%   1 = Output directory. This routine will create output directory if it doesn't exist.
  %doc%   2 = SS label name. Use LATEST if you want to get the latest out from SS.
  %doc%   3 to N = Name of SS object(s) to get
  call :docExample jdev\myprojects\oracle\apps\fnd latest $/jdev/myprojects/oracle/apps/fnd
  %docEOF%

  if not exist %1  mkdir %1
  pushd %1
    :SsChkOutUtilLoop
      call :SsChkOut %3 %2
      shift /3
      if /i "%3" NEQ "" goto :SsChkOutUtilLoop
  popd
goto :EOF

::************* [private] SsChkOut             - SourceSafe check out routine
:SsChkOut
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% SourceSafe check out routine
  call :docParameters
  %doc%   1 = Name of SS object to get
  %doc%   2 = SS label name. Use LATEST if you want to get the latest out from SS.
  call :docExample $/jdev/myprojects/oracle/apps/fnd/framework/webui
  %docEOF%

  if /i "%2" EQU "LATEST" (
    echo Checking Out %1 ...
    %SS% checkout -r %1 -gwr -I-Y >nul 2>&1
  ) else (
    echo Checking Out %1 Label[%2] ...
    %SS% checkout -r %1 -gwr -I-Y "-VL%2" >nul 2>&1
  )

goto :EOF

::************* [private] SsGet                - SourceSafe get routine
:SsGet
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% SourceSafe get routine
  call :docParameters
  %doc%   1 = Name of SS object to get
  %doc%   2 = SS label name. Use LATEST if you want to get the latest out from SS.
  %doc%   3 = true or false. Recursive get?
  call :docExample $/jdev/myprojects/oracle/apps/fnd/framework/webui/OAPageBean.java latest true
  %docEOF%

  :: I don't know why but you can no longer do this ...
  ::    %SS% get %1 -I-Y-O>bogus.txt -GWR  2>&1
  ::
  :: The line had to be changed to this ..
  ::    %SS% get %1 -rgw -I-Y-O>bogus.txt 2>&1
  set recursiveFlag=
  if /i "%3" EQU "true" set recursiveFlag=-r

  if /i "%2" EQU "LATEST" (
    %DASH% Getting %1 ...
    %SS% get %1 %recursiveFlag% -gwr -I-Y >nul 2>&1
  ) else (
    %DASH% Getting %1 Label [%2] ...
    %SS% get %1 %recursiveFlag% -gwr -I-Y "-VL%2" >nul 2>&1
  )

goto :EOF

::************* [public]  getStandardClassPath - Gets the CLASSPATH environment variable
:getStandardClassPath
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Gets the CLASSPATH environment variable
  call :docParameters
  %doc%   1 = Location of myprojects\oracle\apps\[prod] directory (Eg H:\jdevhome\jdev)
  %doc%   2 = Location of Jdev installation (ie %NT_BLD%\jdev, %J_NT%\Jdev_57g_m36, etc.)
  %doc%   3 = Temporary Drive Letter (Eg I:, H:, etc)
  call :docExample h:\jdevhome\jdev %NT_BLD%\jdev I:
  %docEOF%

  call :SetupClassPath %2 minimal %3 N
  set ClassPath=%1\myclasses;%ClassPath%
goto :EOF

::************* [private] getClassPath         - Gets the CLASSPATH environment variable and verify zips in the classpath exists
:getClassPath
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Gets the CLASSPATH environment variable and verify zips in the classpath exists
  call :docParameters
  %doc%   1 = Location of Jdev installation (ie %NT_BLD%\jdev, %J_NT%\Jdev_57g_m36, etc.)
  %doc%   2 = Temporary Drive Letter (Eg I:, H:, etc)
  call :docExample %NT_BLD%\jdev I:
  %docEOF%

  call :SetupClassPath %1 minimal %2 Y

goto :EOF

::************* [private] SetupClassPath       - Setup the CLASSPATH environment variable and verify zips in the classpath exists
:setupClassPath
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Setup the CLASSPATH environment variable and verify that all zips in the classpath exists
  call :docParameters
  %doc%   1 = Location of Jdev installation (ie %NT_BLD%\jdev, %J_NT%\Jdev_57g_m36, etc.)
  %doc%   2 = Classpath Options - build or javadoc or minimal
  %doc%   3 = Temp Drive Letter (ie H:, I:, etc)
  %doc%   4 = verify. Verify that files in classpath exist. You must be able to write to the %J% drive.
  call :docExample %NT_BLD%\jdev build h: Y
  %docEOF%

  if /i "%gotClassPath%" EQU "Y" goto :EOF

  set gotClassPath=Y

  :: Hack to get around 2048 character limit when calling set classpath
  subst %3 %1

  :: NOTE: We don't use all the files in $/jdev/dependencies because not all these files are required at Compile Time.
  call :GetIdeVersion %1
  set IdeVersion=%RET%
  if /i "%IdeVersion%" EQU "1013" (
  set Apps=%3\jdev\appslibrt\classes12.jar;%3\jdev\appslibrt\atg.zip;%3\jdev\appslibrt\collections.zip;%3\jdev\appslibrt\xmlparserv2.jar;%3\jdev\appslibrt\rosettaRt.zip;%3\jdev\appslibrt\svc.zip;%3\jdev\appslibrt\pat.zip;%3\jdev\appslibrt\concurrent.zip;%3\jdev\appslibrt\wsrp-container.jar;%3\jdev\appslibrt\pdkjava.jar;%3\jdev\appslibrt\ptlshare.jar;%3\jdev\appslibrt\xml.jar;%3\jdev\appslibrt\wsrp-container-types.jar;%3\jdev\appslibrt\jaxb-impl.jar;%3\jdev\appslibrt\jaxb-libs.jar;%3\jdev\appslibrt\jazn.jar;%3\jdev\appslibrt\jazncore.jar
  ) else (
  set Apps=%3\jdev\appslibrt\classes12.jar;%3\jdev\appslibrt\appsSSO.zip;%3\jdev\appslibrt\aolj.jar;%3\jdev\appslibrt\flex.jar;%3\jdev\appslibrt\wf.zip;%3\jdev\appslibrt\ak.zip;%3\jdev\appslibrt\collections.zip;%3\jdev\appslibrt\xmlparserv2.jar;%3\jdev\appslibrt\rosettaRt.zip;3\jdev\appslibrt\jttComn.zip;%3\jdev\appslibrt\svc.zip;%3\jdev\appslibrt\pat.zip;%3\jdev\appslibrt\concurrent.zip;%3\jdev\appslibrt\wsrp-container.jar;%3\jdev\appslibrt\pdkjava.jar;%3\jdev\appslibrt\ptlshare.jar;%3\jdev\appslibrt\xml.jar;%3\jdev\appslibrt\wsrp-container-types.jar;%3\jdev\appslibrt\jaxb-impl.jar;%3\jdev\appslibrt\jaxb-libs.jar;%3\jdev\appslibrt\jazn.jar;%3\jdev\appslibrt\jazncore.jar
  )
  if /i "%2" NEQ "minimal" (
    if /i "%IdeVersion%" EQU "1013" (
    set Apps=dependencies\dbg\classes12.jar;dependencies\dbg\atg.zip;dependencies\dbg\oamMaintMode.zip;dependencies\dbg\collections.zip;dependencies\dbg\xmlparserv2.jar;dependencies\dbg\pat.zip;dependencies\dbg\concurrent.zip;dependencies\dbg\diagnostics.jar;dependencies\dbg\wsp.zip;dependencies\dbg\fwkCabo.zip;dependencies\dbg\wsrp-container.jar;dependencies\dbg\pdkjava.jar;dependencies\dbg\ptlshare.jar;dependencies\dbg\xml.jar;dependencies\dbg\wsrp-container-types.jar;dependencies\dbg\jaxb-impl.jar;dependencies\dbg\jaxb-libs.jar;dependencies\dbg\jazn.jar;dependencies\dbg\jazncore.jar
    ) else (
    set Apps=dependencies\dbg\classes12.jar;dependencies\dbg\appsSSO.zip;dependencies\dbg\aolj.jar;dependencies\dbg\oamMaintMode.zip;dependencies\dbg\flex.jar;dependencies\dbg\wf.zip;dependencies\dbg\ak.zip;dependencies\dbg\collections.zip;dependencies\dbg\xmlparserv2.jar;dependencies\dbg\jttComn.zip;dependencies\dbg\pat.zip;dependencies\dbg\concurrent.zip;dependencies\dbg\diagnostics.jar;dependencies\dbg\wsp.zip;dependencies\dbg\fwkCabo.zip;dependencies\dbg\wsrp-container.jar;dependencies\dbg\pdkjava.jar;dependencies\dbg\ptlshare.jar;dependencies\dbg\xml.jar;dependencies\dbg\wsrp-container-types.jar;dependencies\dbg\jaxb-impl.jar;dependencies\dbg\jaxb-libs.jar;dependencies\dbg\jazn.jar;dependencies\dbg\jazncore.jar
     )
  )

  set OracleEl=%3\jakarta-commons-el\oracle-el.jar;%3\jakarta-commons-el\commons-el.jar;%3\jakarta-commons-el\jsp-el-api.jar
  set BiBeans=%3\bibeans\lib\bicmn.jar;%3\bibeans\lib\bicmn-nls.zip;%3\bibeans\lib\bipres.jar;%3\bibeans\lib\bipres-nls.zip;%3\bibeans\lib\bidatacmn.jar;%3\bibeans\lib\biext.jar
  set Portal=%3\jdev\appslibrt\portalFlexComps.jar
  set Uix=%3\jdev\appslibrt\uix2.jar;%3\jdev\appslibrt\share.jar;%3\jdev\appslibrt\regexp.jar
  set Jdev=%3\jlib\jdev-cm.jar
  set J2ee=%3\j2ee\home\lib\jta.jar;%3\j2ee\home\lib\ejb.jar;%3\j2ee\home\lib\servlet.jar;%3\j2ee\home\oc4j.jar

  set Jrad=%3\oaext\mds\lib\mdsrt.jar;%3\oaext\lib\oamdsdt.jar;%3\oaext\lib\mdsdt.jar
  set Bc4j=%3\BC4J\lib\bc4jmt.jar;%3\BC4J\lib\bc4jmtejb.jar;%3\BC4J\lib\bc4jdomorcl.jar;%3\BC4J\jlib\bc4jhtml.jar;%3\BC4J\lib\bc4jct.jar
  set Soap=%3\webservices\lib\soap.jar

  set ClassPath=%3\jdk\jre\lib\rt.jar;%Apps%;%BiBeans%;%Uix%;%Jrad%;%Bc4j%;%Jdev%;%J2ee%;%Soap%;%OracleEl%;%Portal%

  if /i "%2" EQU "build" (
    set ClassPath=myclasses;%ClassPath%
  ) else (
    set ClassPath=%ClassPath%;%3\jdev\appslibrt\fwk.zip;%3\jdev\appslibrt\fwkjbo.zip
  )
  echo -----------------------------------------------------------------------
  echo ClassPath=%ClassPath%
  echo -----------------------------------------------------------------------

  if /i "%4" EQU "y" (
    call :VerifyFilesExist %ClassPath%
    if defined missing_files (
      echo Subject: Obsolete files in build.bat's classpath? %missing_files%  > %T_FWK_BLD%\tmp_mail_msg
      call :SendMail tmp_mail_msg  subhalaxmi.anaparthi@oracle.com sreedevi.ette@oracle.com
    )
  )

  set BiBeans=
  set Uix=
  set Jrad=
  set Bc4j=
  set Jdev=
  set Apps=
  set J2ee=
  set Soap=
  set OracleEl=
  set Portal=

goto :EOF

::************* [private] VerifyFilesExist     - Given a list of files, assert that they exist
:VerifyFilesExist
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Given a list of files, assert that they do exist.
  %doc% Returns files which could not be found in the variable missing_files.
  call :docParameters
  %doc%   1 To N = files which should exist on hard drive. Files can be delimited by comma, semi-colon or space.
  call :docExample file1.zip;file2.jar;h:\jdevhome\jdev\build.bat
  %docEOF%

  :VerifyFilesExistLoop
    set chk=false
    echo %1 | find "." /i > nul
    if "%errorlevel%" EQU "0" set chk=true
    if "%chk%" EQU "true" (
      if not exist %1 (
        echo missing file in classpath [%1]
        set missing_files=%missing_files% %1
      )
    )
    shift
    if /i "%1" NEQ "" goto :VerifyFilesExistLoop
goto :EOF

::************* [private] Blank                - Given a list of directories, insure that they exist and that they are empty
:blank
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Given a list of directories, insure that they exist and that they are empty
  call :docParameters
  %doc%   1 to N = List of directories that will be created and blanked out
  call :docExample c:\work\temp c:\work\tmp2
  %docEOF%

  :blank_loop
    if exist %1  echo Removing old %1 ...
    if exist %1  rmdir/s/q  %1
    mkdir %1
    shift
    if "%1" NEQ "" goto :blank_loop

goto :EOF

::************* [private] SendMail             - Attempts to send mail using rsh command. Failover will print mail message to screen.
:SendMail
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Attempts to send mail using rsh command. Failover will print mail message to screen.
  %doc%.
  call :docParameters
  %doc%   1 = Name of mail message text file. (eg tmpMsg)
  %doc%       ASSUMPTION: All filenames as specified by parameter 1 must exist in %T_FWK_BLD%
  %doc%   ----- optional parameter(s) -----
  %doc%   2 to N = list of recepients separated by a space (Eg fwkdev_us@oracle.com fwk_dev_in@oracle.com)
  call :docExample tmpMailMsg delete fwkdev_us@oracle.com fwk_dev_in@oracle.com  subhalaxmi.anaparthi@oracle.com sreedevi.ette@oracle.com
  %docEOF%

  call :Unix %UNX_BLD%/build mailRoutine %UNX_T_FWK_BLD%/%1 delete %2 %3 %4 %5 %6 %7 %8 %9

  if /i "%RET%" EQU "failed" (
    %DASH% SendMail failed: Dumping mail message to screen ...
    type %T_FWK_BLD%\%1
    del/q %T_FWK_BLD%\%1
  )
goto :EOF

::************* [private] Unix                 - Execute any Unix command. NOTE: Case Sensitive!
:Unix
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Execute any Unix command.
  %doc%.
  %doc% NOTE: This routine uses rsh to ap814sun. In order to use this routine, your
  %doc%       PC must be registered in /etc/hosts and /etc/hosts.equiv on ap814sun.
  call :docParameters
  %doc%   CAUTION: Parameters for this routine are case sensitive
  %doc%   1 to N = Unix Command
  call :docExample ls -l %J_UNX%/NT
  %docEOF%

  call :printBanner Start %0 [%*]
:: Adding if condition to work on both Mark's-pc & rws70001ide
  hostname > temp.txt
  set /p HOST= < temp.txt
  del temp.txt
  if /i "%HOST%" EQU "rws70001ide"   C:\"Program Files"\PuTTY\plink -ssh atgops1@rws60001utl -i c:\key\tesm_key.ppk  %*
  if /i "%HOST%" EQU "mmnakamu-pc1"  D:\myprograms\ssh\bin\ssh atgops1@rws60001utl %*
  :: D:\myprograms\ssh\bin\ssh atgops1@rws60001utl %*
  :: rsh ap814sun -l atgops1 %*
:: Modification Done 

  if /i "%errorlevel%" EQU "1"  set RET=failed

  call :printBanner End %0
goto :EOF

::************* [private] Linux                - Execute any Linux command. NOTE: Case Sensitive!
:Linux
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Execute any Linux command. NOTE: Case Sensitive!
  %doc%.
  %doc% NOTE: This routine uses ssh to jdevlinux1. In order to use this routine, your
  %doc%       PC and key must be registered in the /home/[name]/.ssh/authorized_keys file.
  %doc%.
  call :docParameters
  %doc%   CAUTION: Parameters for this routine are case sensitive
  %doc%   1 to N = Linux Command
  call :docExample ls -l %J_UNX%/NT
  %docEOF%

  call :printBanner Start %0 [%*]

:: Adding if condition to work on both Mark's-pc & rws70001ide
  hostname > temp.txt
  set /p HOST= < temp.txt
  del temp.txt
  if /i "%HOST%" EQU "rws70001ide"   C:\"Program Files"\PuTTY\plink -ssh atgops1@rws60001utl -i c:\key\tesm_key.ppk  %*
  if /i "%HOST%" EQU "mmnakamu-pc1"  D:\myprograms\ssh\bin\ssh atgops1@rws60001utl %*
  :: D:\myprograms\ssh\bin\ssh atgops1@rws60001utl %*
:: Modification Done 

  if /i "%errorlevel%" EQU "1"  set RET=failed

  call :printBanner End %0
goto :EOF

:: -----------------------------------------------------
:: --               D A T E   R O U T I N E S         --
:: -----------------------------------------------------
::************* [private] GetYear              - Returns the year in YYYY format
::************* [private] GetMonth             - Returns the month in MM format
::************* [private] GetDD                - Returns the date in DD format
::************* [private] GetDay               - Returns the day (Mon, Tue, Wed, Thu, Fri, Sat, Sun)
::************* [private] GetTime              - Returns the time in HHMMa or HHMMp format (Example: 1215p for 12:15pm)
:getYear
:getMonth
:getDD
:getDay
:getTime
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  if /i "%0" == ":getyear"  %doc% Returns the year (YYYY) in the variable RET
  if /i "%0" == ":getmonth" %doc% Returns the month (MM) in the variable RET
  if /i "%0" == ":getdd"    %doc% Returns the date (DD) in the variable RET
  if /i "%0" == ":getday"   %doc% Returns the day (Mon, Tue, etc.) in the variable RET
  if /i "%0" == ":gettime"  %doc% Returns the time (HHMMa or HHMMp) in the variable RET
  call :docParameters
  %doc%   ----- optional parameter(s) -----
  %doc%   1 = dateTime to be parsed (eg: 2000_12_20_Sun_300a). Default calls getDateTime to get current date.
  call :docExample
  %docEOF%

  if /i "%0" == ":getyear"  call :parseDate 1 %1
  if /i "%0" == ":getmonth" call :parseDate 2 %1
  if /i "%0" == ":getdd"    call :parseDate 3 %1
  if /i "%0" == ":getday"   call :parseDate 4 %1
  if /i "%0" == ":gettime"  call :parseDate 5 %1
goto :EOF

::************* [private] GetDate              - Returns the date in YYYY_MM_DD_[day] format (Example: 2002_10_31_Thu)
:getDate
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Returns the date (YYYY_MM_DD_[day]) in the variable RET
  call :docParameters
  %doc%   ----- optional parameter(s) -----
  %doc%   1 = dateTime to be parsed (eg: 2000_12_20_Sun_300a). Default calls getDateTime to get current date.
  call :docExample
  %docEOF%

  set RET=%1
  if "%1" == "" call :getDateTime
  set currDateTime=%RET%

  call :parseDate 1 %currDateTime%
  set x=%RET%
  call :parseDate 2 %currDateTime%
  set x=%x%_%RET%
  call :parseDate 3 %currDateTime%
  set x=%x%_%RET%
  call :parseDate 4 %currDateTime%
  set RET=%x%_%RET%
goto :EOF

::************* [private] napPushSqlDeveloper  - Push of SqlDeveloper installation to NAP drive
:napPushSqlDeveloper
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  call :docParameters none
  call :docExample
  %docEOF%

  call :getDateTime
  set x=%RET: =%

  call :linux %UNX_BLD%/build napPushSqlDeveloper %x%
goto :EOF

::************* [private] GetDateTime          - Returns current date/time. (Example: 2002_10_31_Thu_1215p)
:getDateTime
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Returns current date/time (YYYY_MM_DD_[day]_[time]) in the variable RET. (Example: 2002_10_31_Thu_1215p).
  call :docParameters none
  call :docExample
  %docEOF%

  for /f "tokens=1,2,3 delims=/" %%i in ('date /t') do set CurrDate=%%i_%%j_%%k
  set CurrDate=%CurrDate: =_%
  for /f "tokens=1,2,3,4 delims=_" %%i in ("%CurrDate%") do set RET=%%l_%%j_%%k_%%i
  set RET=%RET: =%
  set CurrDate=%RET%

  for /f "tokens=1,2 delims=:" %%i in ('time /t') do set RET=%%i%%j
  set RET=%RET: =%
  set RET=%CurrDate%_%RET%
goto :EOF

::************* [private] ParseDate            - Parses the date into pieces
:parseDate
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Returns a token from the date/time format YYYY_MM_DD_[day]_[time] in the variable RET.
  call :docParameters
  %doc%   1 = 1 (year), 2 (month), 3 (dd), 4 (day) or 5 (time)
  %doc%   ----- optional parameter(s) -----
  %doc%   2 = dateTime obtained by calling getDateTime (eg: 2000_12_20_Sun_300a). If blank automatically calls getDateTime to get current date.
  call :docExample 3
  %docEOF%

  set RET=%2
  if "%2" EQU "" call :getDateTime

  for /f "tokens=%1 delims=_" %%i in ("%RET%") do set RET=%%i
goto :EOF


:: ************* [private] ExtNapPush     - Builds EXT zip file & Installs at at given public area, maintaining 2 versions.
:ExtNapPush
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Builds EXT zip file and Installs at at given public area, maintaining 2 versions.
  call :docParameters
  %doc%   1 = SS Branch. (ie jdev, jdev57H, etc.)
  %doc%   2 = Location of optimized Jdev zip file (ie X:\jt_rad\releases\9_0_3_8_3_510E\9.0.3.762\nondebug_jrad\jdev9033.zip)
  %doc%   3 = SS label name. Use LATEST if you want to get the latest out from SS  or if you have
  %doc%       the build label for this EXT release use that. The SS label is usually in the format of 90388_1032
  %doc%   4 = Explicit Location of "small" Jdev IDE Zip file. (Eg J:\NT\FWK\build\jdev_dbg_903812_1290\jdev903_dbg.zip)
  call :docExample jdev X:\jt_rad\releases\9_0_3_8_3_510E\9.0.3.762\nondebug_jrad\jdev9033.zip 90388_1032 J:\NT\FWK\build\jdev_dbg_903812_1290\jdev903_dbg.zip
  %docEOF%

  call :printBanner Start %0 [%*]

  call :BldExtZip %1 %2 %3 %EXT_FWK%

  :: TRICKY
  :: Since %4 can potentially point to the symbolic link directory (eg /jdevbin/ext/fwk/jdev),
  :: %4 can be deleted/wiped out by :InstallJdevExt because it switches the symbolic link directory.
  :: In this case when try to install %4 into the directory (%1_%3) created by ::InstallJdevExt, we need
  :: to tuck away %4 now and use it later. Make sure to clean up this tmp directory later.
  set ExtNapPushTmpDir=%EXT_FWK%\ExtNapPushTmpDir_%1_%3
  call :blank %ExtNapPushTmpDir%
  %xcopy%/f %4 %ExtNapPushTmpDir%

  %DASH% Calling InstallJdevExt to Install the jdevExt.zip at location: %UNX_EXT_FWK%
  call :InstallJdevExt %UNX_EXT_FWK% %1_%3 %1 %UNX_EXT_FWK%/jdevExt.zip

  ::call :CleanupUtil %UNX_EXT_FWK%/%1_903 2
  call :CleanupUtil %UNX_EXT_FWK%/%1903_20 2 %UNX_EXT_FWK%/%11013_20 2 %UNX_EXT_FWK%/%1_903 2 %UNX_EXT_FWK%/%1_200 2 %UNX_EXT_FWK%/%11013_200 2
  :: call :CleanupUtil %UNX_EXT_FWK%/%1903_20 2 %UNX_EXT_FWK%/%11013_20 2
  call :unix rm %UNX_EXT_FWK%/jdevExt.zip

  :: Get the tucked away copy now and install it. Be sure to cleanup the tmp directory.
  %xcopy%/f %ExtNapPushTmpDir%\* %EXT_FWK%\%1_%3\
  rmdir/s/q %ExtNapPushTmpDir%

  call :printBanner End %0
goto :EOF

::************* [public]  RsynchSymbolicLinkCleanup - Removes Symbolic Links having their Corresponding folders missing
:RsynchSymbolicLinkCleanup
if defined TRACE %TRACE% [%0 %*]
  call :docHeader
  %doc% Removes Symbolic Links (from RSYNCH area) having their corressponding folders missing
  call :docExample
  %docEOF%

  :: Jump to Unix and run SymbolicLinkCleanup Routine.
    echo.
    call :printBanner Jump to Unix and run SymbolicLinkCleanup Routine ....
    call :unix %UNX_BLD%/build SymbolicLinkCleanup %J_UNX%/NT/RSYNCH

goto :EOF


:: -----------------------------------------------------
:: --               H E L P   R O U T I N E S         --
:: -----------------------------------------------------
::*** [private] docHeader                      - Help Utility: Prints routine name
:docHeader
  %doc%.
  %doc% ****** %API_NAME% ******
goto :EOF

::*** [private] docParameters                  - Help Utility: Prints "Parameters passed to <routine>"
:docParameters
  %doc%.
  %doc% Parameter(s) passed to %API_NAME%:
  if /i "%1"=="none"  %doc%   NONE
goto :EOF

::*** [private] docExample                     - Help Utility: Prints "Example: <example of params to pass to routine>"
:docExample
  %doc%.
  %doc% Example: build %API_NAME% %1 %2 %3 %4 %5 %6 %7 %8 %9
  %doc%.
goto :EOF
