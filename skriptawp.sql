--create database edunovawp7;
use master;
go
drop database if exists edunovawp7;
go
create database edunovawp7
go
use edunovawp7;
--use edunovawp7;

create table smjerovi(
sifra int,
naziv varchar(50),
trajanje int, 
cijena decimal(18,2),
vaucer bit,
izvodiseod datetime
); 