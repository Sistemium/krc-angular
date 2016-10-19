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
    ) as errorWords
  FROM krc.FoundWord
  GROUP BY [date]
;


/*

select * from krc.DailyStats
where [date] >= today () - 7
order by 1 desc

*/
