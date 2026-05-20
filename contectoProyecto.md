Vale , Estpy estudiando segundo de DAM en IES lestacio en ontinyent , estoy en mi segundo año y estoy haciendo el TFG. Tengo que hacer la memoria y documentacion por lo que voy a darte todo el contexto posible para que me puedas ayudar con eso.

El prouecto es una app que permite reservar pistas de un centro deportivo o un polideportivo. Consiste en una UI simple para un user que tendra la app en su movil o web si lo prefiere donde el usuario tendra su perfil personalizable pero sobretodo una pantalla home con informacion sobre sus reservas futuras y botones para pantalla de hacer reservas eligiendo la pista , consultar disponibilidad graficamente , eligir el horario y  la duracion de la reserva y finalmente el proceso de pago con la confirmacion de su reserva.

Eso es la parte del cliente del frontend y el admin tendra otro panel que al hacer login se comprueba el rol por lo que si el user es admin entrara en su panel de admin donde tendra una pantalla con botones que lo llevaran a la pantalla del respeto boton osea si es el boton de Pistas llegara a la gestion de pistas donde tendra el crud y podra gestionar todas las pistas y eso para users , pistas , tipos de pista , reservas , pagos , reseñas etc. Rambien el user despues de haber reservado una pista y esa reserva haya finalizado tendra la opcion de añadir una reseña a la pista en la que ha hecho la reserva y dar una puntuacion entre 1-5 que se muestran como estrellas en las pistas y los demas usuarios podran consultar.El admin tambien tiene una vista de ttres grafos que muestran en una pie chart en porcentajes las reservas filtrados por estados osea mostraria tanto porciento en confirmado , tanto en finalizado etc , otro grafo de reservas en relacion a tiempo que se puede ajustar a anual , menusal etc y otro grafo que muestra las pistas y sus valoraciones.



Todo eso esta hecho usando react native y expo go en frontend que se controla para que vaya en web ios y android , y de ota parte apunta a un backend propio hecho en Nestjs .

Todo esta subido a una VPS en hetzner donde tenemos el dominio respi.es reservado para nuestro server y donde al acceder se puede acceder al proyecto frontend desplegado en el server para web y en respi.es/api al app.service.ts donde hay un html/css/js configurado que muestra una serie de detalles sobre el proyecto y botones quepermiten la descarga de la apk , redireccion a respi.es y otro de redireccion a respi.es/api/swagger 



FRONT:https://github.com/Christopher-Blc/Respi_Frontend.git

Back:https://github.com/Christopher-Blc/ProyectoApp_Acceso_A_Datos.git