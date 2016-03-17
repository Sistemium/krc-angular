meta.defineType 'opr.word:STRING';

meta.defineEntity 'opr.NotFoundWords', 'word';
meta.defineEntity 'opr.FoundWords', 'word';

meta.createTable 'opr.NotFoundWords',0,1;
meta.createTable 'opr.FoundWords',0,1;

select * from opr.FoundWords
select * from opr.NotFoundWords
