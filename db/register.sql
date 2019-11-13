insert into users (email, password, isadmin)
values ($1, $2, $3)
returning *
;