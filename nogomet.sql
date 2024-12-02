use master;
go
drop database if exists nogomet;
go
create database nogomet
go
use nogomet;
go
create table klub(
sifra int not null primary key identity(1,1),
naziv varchar(50) not null,
osnovan datetime not null,
stadion varchar(50) not null,
predsjednik varchar(50) not null,
drzava varchar(50) not null,
liga varchar(50)not null
liga int
  );

  create table



use nogomet;

