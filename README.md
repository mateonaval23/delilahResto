# delilahResto
Proyecto delilah resto para Acamica

1. Como primer paso se debera crear la base de datos. Para eso deberan correr el script de creacion de bas de datos ubicado en el archivo **CREATE_DATABASE.sql**.
2. Una vez creada la base de datos debera modificarse los datos de conexión ubicados en el archivo del proyecto `data/mysql.js`.
```js
const sequelize = new Sequelize('mysql://root@localhost:3306/delilahresto');
```
3. Desde una consola de comandos, posicionarse en el proyecto, y ejecutar el siguiente comando: `npm i`. Este comando instalara todos las dependencias necesarias para que se pueda correr el proyecto en su maquina.
4. Cuando haya finalizado toda la instalación, deberan ejecutar el comando `npm run start`. Este mismo se encuentra configurado como script en el archivo `package.json`.
5. Para consultar los endpoint de la Web API, pueden consultar el archivo spec.yml referido en la especificacion de Open API (Swagger).



