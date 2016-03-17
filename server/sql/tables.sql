grant connect to krc;
grant dba to krc;

meta.defineType 'krc.word:STRING';

meta.defineEntity 'krc.NotFoundWord', 'word';
meta.defineEntity 'krc.FoundWord', 'word';

meta.createTable 'krc.NotFoundWord',0,1;
meta.createTable 'krc.FoundWord',0,1;

select * from krc.FoundWord
select * from krc.NotFoundWord
