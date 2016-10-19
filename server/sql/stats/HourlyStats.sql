create or replace view krc.HourlyStats as
  SELECT
    date(ts) as [date],
    hour(ts) as [hour],
    count (distinct deviceUUID) devices,
    count (*) foundWords,
    (select count (distinct word)
      from krc.NotFoundWord
      where ts BETWEEN dateadd(hour, [hour], [date]) and dateadd(hour, [hour]+1, [date])
    ) as notFoundWords,
    (select count (distinct word)
      from krc.ErrorWord
      where ts BETWEEN dateadd(hour, [hour], [date]) and dateadd(hour, [hour]+1, [date])
    ) as errorWords
  FROM krc.FoundWord
  WHERE ts > today () - 1
  GROUP BY
    [date],
    [hour] DESC
;

/*

select * from krc.HourlyStats
where [date] >= today () - 2
order by 1 desc, 2 desc

*/
