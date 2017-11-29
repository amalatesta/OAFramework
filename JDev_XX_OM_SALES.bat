@echo off

setlocal

set JDEV_HOME=C:\oracle\OA_Framework\jdevbin

set JDEV_USER_HOME=C:\oracle\OA_Framework\jdevhome\jdev

REM set JDEV_USER_HOME=C:\oracle\OA_Framework\jdevhome\jdev\myprojects

REM set JDEV_USER_HOME=C:\oracle\GitHub\jdevhome\jdev\myprojects

REM set JDEV_USER_HOME=C:\oracle\GitHub\jdevhome\jdev

start "Jdeveloper" %JDEV_HOME%\jdev\bin\jdevw.exe

endlocal
