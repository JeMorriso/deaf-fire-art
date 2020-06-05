drop database deaf_fire_art;
create database if not exists deaf_fire_art;
use deaf_fire_art;

create table images (
    id int auto_increment primary key,
    index_ int not null,
    file_prefix varchar(255) not null,
    item_description varchar(255),
    item_price decimal(13, 2),
    created_at timestamp default now()
);
