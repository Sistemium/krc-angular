grant connect to krc;
grant dba to krc;

meta.defineType 'krc.word:STRING';
meta.defineType 'krc.deviceUUID:uniqueidentifier,,nullable';
meta.defineType 'krc.status:INT';
meta.defineType 'krc.error:STRING';

meta.defineEntity 'krc.NotFoundWord', 'word;deviceUUID';
meta.defineEntity 'krc.FoundWord', 'word;deviceUUID';
meta.defineEntity 'krc.ErrorWord',
  'word;status;error;deviceUUID'
;

meta.createTable 'krc.NotFoundWord',0,1;
meta.createTable 'krc.FoundWord',0,1;
meta.createTable 'krc.ErrorWord',0,1;

create index XK_krc_FoundWord_word_id on krc.FoundWord (word, id);
