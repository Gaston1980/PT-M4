
-- Descargan el archivo de la base de datos, les conviene dejarlo en el escritorio así lo tienen a mano. El archivo se llama imdb-large.sqlite3.db
-- Abro simbolo del sistema, el path se abre en el directorio raiz
-- Pongo el comando dir (es como "l" en bash) para ver mi directorio
-- cd OneDrive, cd Escritorio (en mi caso, ustedes se desplazan el directorio hasta el lugar donde tienen guardado el archivo descargado)
-- Ignoro toda la primer parte del readme. Directamente pongo: sqlite3 imdb-large.sqlite3.db
-- .tables --> me muestra que ya tengo cargada la db
-- .schema actors --> es un ejemplo para mostrarles que ya me muestra la estrcutura de la tabla
-- Si todo está ok, ya podemos empezar
-- Puedo usar los comandos del readme .header on y .mode column para que me formatee la data como tablas
-- También está el comando .mode box --> es más lindo! Lo deja en forma de tablita con rayas

--1

SELECT * FROM movies 
WHERE year = 1900
limit 15; 

--2
SELECT COUNT(*)
FROM movies 
where year = 1982;

--3
SELECT * FROM actors 
WHERE last_name LIKE '%stack%';

--4
SELECT first_name, last_name, COUNT(*) as total
from actors 
GROUP BY LOWER(first_name), LOWER(last_name)
ORDER BY total DESC
limit 10;

--5
SELECT first_name, last_name, COUNT(*) AS total_roles
from actors
JOIN roles ON actors.id = roles.actor_id
GROUP BY actors.id 
ORDER BY total_roles DESC
limit 10;

--6
SELECT genre, COUNT(*) AS total 
FROM movies_genres
GROUP BY genre
ORDER BY total;

--7
select (first_name || ' ' || last_name) as 'Nombre y Apellido'
from actors
join roles ON roles.actor_id = actors.id
join movies on roles.movie_id = movies.id 
where movies.name = 'Braveheart' AND movies.year = 1995
ORDER BY actors.last_name, actors.first_name;

--8
select directors.first_name, directors.last_name, movies.name, movies.year
from directors
join movies_directors on director_id = directors.id 
join movies on movies.id = movies_directors.movie_id
join movies_genres on movies.id = movies_genres.movie_id
where movies_genres.genre = 'Film-Noir' AND movies.year % 4 = 0
ORDER by movies.name;

--9
select first_name, last_name, movies.name 
from actors 
join roles on actors.id = roles.actor_id
join movies on movies.id = roles.movie_id
join movies_genres on movies.id = movies_genres.movie_id
where movies_genres.genre = 'Drama' AND movies.id IN(
    select roles.movie_id
    from roles
    join actors ON roles.actor_id = actors.id
    where actors.first_name = 'Kevin' AND actors.last_name = 'Bacon'
) AND (actors.first_name  || ' ' || actors.last_name != 'Kevin Bacon');

--10
select first_name, last_name from actors
where id in (
    select actor_id
    from roles 
    join movies on movies.id = roles.movie_id
    where movies.year < 1900 AND movies.year > 2000
)
limit 10;

--11 OK! 
select first_name, last_name, movies.name, COUNT(DISTINCT(role)) as total
from actors
join roles on actors.id = roles.actor_id
join movies on movies.id = roles.movie_id
where movies.year > 1990
GROUP by roles.actor_id, roles.movie_id
having total > 5;

--12
select year, COUNT(*) as total
from movies where id in(
    select movie_id
    from roles 
    join actors on actors.id = roles.actor_id
    where actors.gender = 'F'
)
GROUP by year;
