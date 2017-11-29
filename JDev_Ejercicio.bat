@echo off

setlocal

set JDEV_HOME=C:\oracle\OA_Framework\jdevbin

REM set JDEV_USER_HOME=C:\oracle\OA_Framework\jdevhome\jdev

REM set JDEV_USER_HOME=C:\oracle\OA_Framework\jdevhome\jdev\myprojects

start "Jdeveloper" %JDEV_HOME%\jdev\bin\jdevw.exe

endlocal
