--create database rodjendan;

--use rodjedan;

create table rodjendan(
sifra int not null ,
slavljenik int not null,
ime varchar(100) not null,
datum date,
primary key (sifra)
);

create table slavljenik(
sifra int not null,
ime varchar(50) not null,
prezime varchar(50) not null,
email varchar(100) not null,
telefon varchar(20) not null,
datum date,
primary key (sifra)
);

create table gosti(
sifra int not null,
rodjendan int not null,
ime varchar(50) not null,
prezime varchar(50) not null,
primary key (sifra)
);

create table usluga(
sifra int not null ,
rodjendan int not null,
gost int not null,
ime varchar(100) not null,
primary key (sifra)
);
