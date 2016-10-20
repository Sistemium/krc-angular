create or replace view krc.DailyStats as
  SELECT
    date(ts) as [date],
    count (distinct deviceUUID) devices,
    count (*) foundWords,
    (select count (distinct word)
      from krc.NotFoundWord
      where ts BETWEEN [date] and [date]+1
    ) as notFoundWords,
    (select count (distinct word)
      from krc.ErrorWord
      where ts BETWEEN [date] and [date]+1
    ) as errorWords,
    (select count (*)
      from krc.foundword fw
      where ts between [date] and [date]+1
      and not exists (select * from krc.foundword where word = fw.word and id < fw.id)
    ) as newWords
  FROM krc.FoundWord
  GROUP BY [date]
;


/*

select * from krc.DailyStats
where [date] >= today () - 7
order by 1 desc

*/
