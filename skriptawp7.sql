-- Ovako se pišu komentari

use master;
go
drop database if exists edunovawp7;
go
create database edunovawp7;
go
use edunovawp7;
go

create table smjerovi(
sifra int not null primary key identity(1,1),
naziv varchar(50) not null,
trajanje int null, -- null se ne mora pisati
cijena decimal(18,2),
vaucer bit,
izvodiseod datetime
);

create table polaznici(
sifra int not null primary key identity(1,1),
ime varchar(50) not null,
prezime varchar(50) not null,
oib char(11),
email varchar(100) not null,
);

create table grupe(
sifra int not null primary key identity(1,1),
naziv varchar(20)not null,
smjer int not null references smjerovi(sifra),-- ovo je vanjski ključ
predavac varchar(50)
);


create table clanovi(
grupa int not null references grupe(sifra),
polaznik int not null references polaznici(sifra)
);