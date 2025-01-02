@echo off
:restart
title Serveo (restarting)
timeout 5 /nobreak
title Serveo
cls
echo Serveo:
call ssh -R nmpbpp:80:localhost:1111 serveo.net
goto restart