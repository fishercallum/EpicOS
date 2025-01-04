@echo off
:restart
title EpicOS
echo Starting.
node DiscordBot.js
echo Bot shutdown. Restarting.
timeout 120
cls
goto :restart
