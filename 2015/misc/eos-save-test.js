// Recovered in the 2017.10.04 archive.
// Used for testing saving of settings.

cmdChar = '/';
botname = 'EpicOS';

MPP.chat.send('Saving settings..');
localStorage.lastcmdChar = cmdChar;
localStorage.lastbotname = botname;

MPP.chat.send('Loading settings..');
cmdChar = localStorage.lastcmdChar;
botname = localStorage.lastbotname;