select 
  distinct a.author 
from 
  author a 
where
  a.filename not in (select if.filename from ignore_files if)
  and not exists (
    select * from 
    tag t join ignore_tag it 
    on t.tag = it.tag 
    where t.filename = a.filename)
order by 
  a.author 