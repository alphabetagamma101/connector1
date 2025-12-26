
The standard trick to exclude the grep command itself from your output without using a second grep -v command is to use a bracket expression for the first character of your search string.

The Recommended Command
Bash

ps -ef | grep "[p]npm run dev"

====
bash command to show only matching line for node /usr/local/bin/pnpm run dev
and skip for grep

ps -ef | grep "pnpm run dev"
  502 63768 63721   0  1:42PM ttys007    0:00.00 grep pnpm run dev
  502 63528 61236   0  1:37PM ttys021    0:00.50 node /usr/local/bin/pnpm run dev