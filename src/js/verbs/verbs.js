const ALL_VERBS = [
    { infinitive: 'arise', pastSimple: 'arose', pastParticiple: 'arisen', spanish: 'surgir', explanation: 'Aparecer un problema o una oportunidad.', imageUrl: 'https://i.imgur.com/GvjYkQj.png' },
    { infinitive: 'awake', pastSimple: 'awoke', pastParticiple: 'awoken', spanish: 'despertar(se)', explanation: 'Dejar de dormir o hacer que alguien lo haga.', imageUrl: 'https://i.imgur.com/6e8GV0g.png' },
    { infinitive: 'be', pastSimple: 'was/were', pastParticiple: 'been', spanish: 'ser/estar', explanation: 'Indica existencia, estado o identidad.', imageUrl: 'https://i.imgur.com/041TSxr.png' },
    { infinitive: 'bear', pastSimple: 'bore', pastParticiple: 'born/borne', spanish: 'soportar', explanation: 'Aguantar algo pesado o difícil; dar a luz.', imageUrl: 'https://i.imgur.com/7zprI00.png' },
    { infinitive: 'beat', pastSimple: 'beat', pastParticiple: 'beaten', spanish: 'golpear', explanation: 'Ganarle a alguien; golpear rítmicamente (un tambor).', imageUrl: 'https://i.imgur.com/qQQb5RQ.png' },
    { infinitive: 'become', pastSimple: 'became', pastParticiple: 'become', spanish: 'convertirse en', explanation: 'Llegar a ser algo diferente; transformarse.', imageUrl: 'https://i.imgur.com/4u5p2qT.png' },
    { infinitive: 'begin', pastSimple: 'began', pastParticiple: 'begun', spanish: 'empezar', explanation: 'Iniciar o comenzar una acción.', imageUrl: 'https://i.imgur.com/Q3ZDHjz.png' },
    { infinitive: 'bend', pastSimple: 'bent', pastParticiple: 'bent', spanish: 'doblar(se)', explanation: 'Curvar algo recto o a sí mismo.', imageUrl: 'https://www.yogaclassplan.com/wp-content/uploads/2021/06/standing-half-forward-bend.jpg' },
    { infinitive: 'bet', pastSimple: 'bet', pastParticiple: 'bet', spanish: 'apostar', explanation: 'Arriesgar dinero en el resultado de algo.', imageUrl: 'https://i.imgur.com/Q6D6aOK.png' },
    { infinitive: 'bind', pastSimple: 'bound', pastParticiple: 'bound', spanish: 'atar', explanation: 'Unir o sujetar algo con cuerdas; encuadernar.', imageUrl: 'https://i.imgur.com/UUxnTFh.png' },
    { infinitive: 'bite', pastSimple: 'bit', pastParticiple: 'bitten', spanish: 'morder', explanation: 'Usar los dientes para cortar algo.', imageUrl: 'https://i.imgur.com/B2x2Mse.png' },
    { infinitive: 'bleed', pastSimple: 'bled', pastParticiple: 'bled', spanish: 'sangrar', explanation: 'Perder sangre por una herida.', imageUrl: 'https://i.imgur.com/T0X8T1q.png' },
    { infinitive: 'blow', pastSimple: 'blew', pastParticiple: 'blown', spanish: 'soplar', explanation: 'Mover el aire con la boca (velas, un globo).', imageUrl: 'https://i.imgur.com/v6LZ5lo.png' },
    { infinitive: 'break', pastSimple: 'broke', pastParticiple: 'broken', spanish: 'romper', explanation: 'Hacer que algo se separe en pedazos.', imageUrl: 'https://i.imgur.com/gltSzEK.png' },
    { infinitive: 'breed', pastSimple: 'bred', pastParticiple: 'bred', spanish: 'criar', explanation: 'Cuidar animales para que se reproduzcan.', imageUrl: 'https://i.imgur.com/EVUOMIl.png' },
    { infinitive: 'bring', pastSimple: 'brought', pastParticiple: 'brought', spanish: 'traer', explanation: 'Llevar algo o a alguien a un lugar.', imageUrl: 'https://i.imgur.com/yIfEhrk.png' },
    { infinitive: 'broadcast', pastSimple: 'broadcast', pastParticiple: 'broadcast', spanish: 'transmitir', explanation: 'Emitir un programa de radio o televisión.', imageUrl: 'https://i.imgur.com/cbBlz59.png' },
    { infinitive: 'build', pastSimple: 'built', pastParticiple: 'built', spanish: 'construir', explanation: 'Crear una estructura como una casa o un edificio.', imageUrl: 'https://i.imgur.com/io1nz1P.png' },
    { infinitive: 'burn', pastSimple: 'burnt/burned', pastParticiple: 'burnt/burned', spanish: 'quemar', explanation: 'Dañar algo con fuego o calor.', imageUrl: 'https://i.imgur.com/rTRFrdc.png' },
    { infinitive: 'burst', pastSimple: 'burst', pastParticiple: 'burst', spanish: 'reventar', explanation: 'Romperse o explotar de repente.', imageUrl: 'https://i.imgur.com/2XfIFqR.png' },
    { infinitive: 'buy', pastSimple: 'bought', pastParticiple: 'bought', spanish: 'comprar', explanation: 'Obtener algo a cambio de dinero.', imageUrl: 'https://i.imgur.com/lAQTFfM.png' },
    { infinitive: 'cast', pastSimple: 'cast', pastParticiple: 'cast', spanish: 'lanzar', explanation: 'Tirar algo con fuerza; seleccionar actores.', imageUrl: 'https://i.imgur.com/BeMrCHV.png' },
    { infinitive: 'catch', pastSimple: 'caught', pastParticiple: 'caught', spanish: 'atrapar', explanation: 'Agarrar algo que se mueve, como una pelota.', imageUrl: 'https://i.imgur.com/YsSDGel.png' },
    { infinitive: 'choose', pastSimple: 'chose', pastParticiple: 'chosen', spanish: 'elegir', explanation: 'Seleccionar una opción entre varias.', imageUrl: 'https://i.imgur.com/umc87Pv.png' },
    { infinitive: 'cling', pastSimple: 'clung', pastParticiple: 'clung', spanish: 'aferrarse', explanation: 'Sujetarse a algo o alguien con fuerza.', imageUrl: 'https://i.imgur.com/oVzNF1S.png' },
    { infinitive: 'come', pastSimple: 'came', pastParticiple: 'come', spanish: 'venir', explanation: 'Moverse hacia el lugar donde está el hablante.', imageUrl: 'https://i.imgur.com/sBYpwGH.png' },
    { infinitive: 'cost', pastSimple: 'cost', pastParticiple: 'cost', spanish: 'costar', explanation: 'Tener un precio determinado.', imageUrl: 'https://i.imgur.com/L3Lx1jo.png' },
    { infinitive: 'creep', pastSimple: 'crept', pastParticiple: 'crept', spanish: 'arrastrarse', explanation: 'Moverse sigilosamente y en silencio.', imageUrl: 'https://i.imgur.com/OVo2YgL.png' },
    { infinitive: 'cut', pastSimple: 'cut', pastParticiple: 'cut', spanish: 'cortar', explanation: 'Dividir algo usando un objeto afilado.', imageUrl: 'https://i.imgur.com/yuO7RLE.png' },
    { infinitive: 'deal', pastSimple: 'dealt', pastParticiple: 'dealt', spanish: 'tratar', explanation: 'Ocuparse de un problema; repartir cartas.', imageUrl: 'https://i.imgur.com/KJ7Fslr.png' },
    { infinitive: 'dig', pastSimple: 'dug', pastParticiple: 'dug', spanish: 'cavar', explanation: 'Hacer un hoyo en la tierra.', imageUrl: 'https://i.imgur.com/HKKcGay.png' },
    { infinitive: 'do', pastSimple: 'did', pastParticiple: 'done', spanish: 'hacer', explanation: 'Realizar una actividad o tarea.', imageUrl: 'https://i.imgur.com/zFdaIgH.png' },
    { infinitive: 'draw', pastSimple: 'drew', pastParticiple: 'drawn', spanish: 'dibujar', explanation: 'Crear una imagen con lápices o bolígrafos.', imageUrl: 'https://i.imgur.com/pNKu5z4.png' },
    { infinitive: 'dream', pastSimple: 'dreamt/dreamed', pastParticiple: 'dreamt/dreamed', spanish: 'soñar', explanation: 'Experimentar imágenes o historias al dormir.', imageUrl: 'https://i.imgur.com/UfOHHM7.png' },
    { infinitive: 'drink', pastSimple: 'drank', pastParticiple: 'drunk', spanish: 'beber', explanation: 'Ingerir un líquido.', imageUrl: 'https://i.imgur.com/kkxR0Lx.png' },
    { infinitive: 'drive', pastSimple: 'drove', pastParticiple: 'driven', spanish: 'conducir', explanation: 'Manejar un vehículo como un coche.', imageUrl: 'https://i.imgur.com/p0vqVE6.png' },
    { infinitive: 'eat', pastSimple: 'ate', pastParticiple: 'eaten', spanish: 'comer', explanation: 'Ingerir alimentos sólidos.', imageUrl: 'https://i.imgur.com/kMI5sM8.png' },
    { infinitive: 'fall', pastSimple: 'fell', pastParticiple: 'fallen', spanish: 'caer', explanation: 'Moverse hacia abajo por la gravedad.', imageUrl: 'https://i.imgur.com/3NkaF2C.png' },
    { infinitive: 'feed', pastSimple: 'fed', pastParticiple: 'fed', spanish: 'alimentar', explanation: 'Dar comida a una persona o animal.', imageUrl: 'https://i.imgur.com/fWJ2NEZ.png' },
    { infinitive: 'feel', pastSimple: 'felt', pastParticiple: 'felt', spanish: 'sentir', explanation: 'Experimentar una emoción o sensación física.', imageUrl: 'https://i.imgur.com/iIpEyWk.png' },
    { infinitive: 'fight', pastSimple: 'fought', pastParticiple: 'fought', spanish: 'pelear', explanation: 'Luchar físicamente o discutir fuertemente.', imageUrl: 'https://i.imgur.com/BH1zqeH.png' },
    { infinitive: 'find', pastSimple: 'found', pastParticiple: 'found', spanish: 'encontrar', explanation: 'Descubrir algo o a alguien que buscabas.', imageUrl: 'https://i.imgur.com/o1hiY8j.png' },
    { infinitive: 'flee', pastSimple: 'fled', pastParticiple: 'fled', spanish: 'huir', explanation: 'Escapar de un lugar o situación de peligro.', imageUrl: 'https://i.imgur.com/3DvnmCi.png' },
    { infinitive: 'fly', pastSimple: 'flew', pastParticiple: 'flown', spanish: 'volar', explanation: 'Moverse por el aire, como un pájaro o un avión.', imageUrl: 'https://i.imgur.com/D94Kx7C.png' },
    // { infinitive: 'forbid', pastSimple: 'forbade', pastParticiple: 'forbidden', spanish: 'prohibir', explanation: 'Ordenar que algo no se haga.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'forget', pastSimple: 'forgot', pastParticiple: 'forgotten', spanish: 'olvidar', explanation: 'No poder recordar algo.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'forgive', pastSimple: 'forgave', pastParticiple: 'forgiven', spanish: 'perdonar', explanation: 'Dejar de sentir enojo hacia alguien por un error.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'freeze', pastSimple: 'froze', pastParticiple: 'frozen', spanish: 'congelar', explanation: 'Convertir un líquido en sólido por el frío.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'get', pastSimple: 'got', pastParticiple: 'got/gotten', spanish: 'conseguir', explanation: 'Obtener, recibir o llegar a un lugar.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'give', pastSimple: 'gave', pastParticiple: 'given', spanish: 'dar', explanation: 'Entregar algo a alguien.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'go', pastSimple: 'went', pastParticiple: 'gone', spanish: 'ir', explanation: 'Moverse de un lugar a otro.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'grind', pastSimple: 'ground', pastParticiple: 'ground', spanish: 'moler', explanation: 'Reducir algo a polvo, como el café.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'grow', pastSimple: 'grew', pastParticiple: 'grown', spanish: 'crecer', explanation: 'Aumentar de tamaño; cultivar plantas.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'hang', pastSimple: 'hung', pastParticiple: 'hung', spanish: 'colgar', explanation: 'Suspender algo desde un punto.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'have', pastSimple: 'had', pastParticiple: 'had', spanish: 'tener', explanation: 'Poseer algo; también se usa como verbo auxiliar.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'hear', pastSimple: 'heard', pastParticiple: 'heard', spanish: 'oír', explanation: 'Percibir sonidos con el oído.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'hide', pastSimple: 'hid', pastParticiple: 'hidden', spanish: 'esconder(se)', explanation: 'Poner algo o a uno mismo donde no se pueda ver.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'hit', pastSimple: 'hit', pastParticiple: 'hit', spanish: 'golpear', explanation: 'Impactar algo o a alguien.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'hold', pastSimple: 'held', pastParticiple: 'held', spanish: 'sostener', explanation: 'Mantener algo con las manos.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'hurt', pastSimple: 'hurt', pastParticiple: 'hurt', spanish: 'herir', explanation: 'Causar dolor físico o emocional.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'keep', pastSimple: 'kept', pastParticiple: 'kept', spanish: 'mantener', explanation: 'Continuar teniendo o haciendo algo; guardar.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'kneel', pastSimple: 'knelt', pastParticiple: 'knelt', spanish: 'arrodillarse', explanation: 'Ponerse de rodillas.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'know', pastSimple: 'knew', pastParticiple: 'known', spanish: 'saber/conocer', explanation: 'Tener información o familiaridad con alguien.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'lay', pastSimple: 'laid', pastParticiple: 'laid', spanish: 'poner, colocar', explanation: 'Poner algo en una superficie, usualmente con cuidado.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'lead', pastSimple: 'led', pastParticiple: 'led', spanish: 'liderar', explanation: 'Guiar a un grupo; estar al frente.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'lean', pastSimple: 'leant/leaned', pastParticiple: 'leant/leaned', spanish: 'apoyarse', explanation: 'Inclinarse o descansar sobre algo.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'leap', pastSimple: 'leapt/leaped', pastParticiple: 'leapt/leaped', spanish: 'saltar', explanation: 'Dar un gran salto.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'learn', pastSimple: 'learnt/learned', pastParticiple: 'learnt/learned', spanish: 'aprender', explanation: 'Adquirir conocimiento o una habilidad.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'leave', pastSimple: 'left', pastParticiple: 'left', spanish: 'dejar/irse', explanation: 'Salir de un lugar; abandonar algo.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'lend', pastSimple: 'lent', pastParticiple: 'lent', spanish: 'prestar', explanation: 'Dar algo a alguien temporalmente.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'let', pastSimple: 'let', pastParticiple: 'let', spanish: 'permitir', explanation: 'Dejar que alguien haga algo.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'lie', pastSimple: 'lay', pastParticiple: 'lain', spanish: 'yacer, tumbarse', explanation: 'Estar en una posición horizontal.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'light', pastSimple: 'lit', pastParticiple: 'lit', spanish: 'encender', explanation: 'Hacer que algo empiece a arder o a dar luz.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'lose', pastSimple: 'lost', pastParticiple: 'lost', spanish: 'perder', explanation: 'No poder encontrar algo; no ganar un juego.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'make', pastSimple: 'made', pastParticiple: 'made', spanish: 'hacer/fabricar', explanation: 'Crear o producir algo.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'mean', pastSimple: 'meant', pastParticiple: 'meant', spanish: 'significar', explanation: 'Tener un significado o querer decir algo.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'meet', pastSimple: 'met', pastParticiple: 'met', spanish: 'conocer/reunirse', explanation: 'Encontrarse con alguien por primera vez o con un propósito.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'mow', pastSimple: 'mowed', pastParticiple: 'mown/mowed', spanish: 'segar, cortar', explanation: 'Cortar el césped.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'pay', pastSimple: 'paid', pastParticiple: 'paid', spanish: 'pagar', explanation: 'Dar dinero por un producto o servicio.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'put', pastSimple: 'put', pastParticiple: 'put', spanish: 'poner', explanation: 'Colocar algo en un lugar.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'read', pastSimple: 'read', pastParticiple: 'read', spanish: 'leer', explanation: 'Mirar y entender texto escrito.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'ride', pastSimple: 'rode', pastParticiple: 'ridden', spanish: 'montar', explanation: 'Viajar en un vehículo como bicicleta, moto o a caballo.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'ring', pastSimple: 'rang', pastParticiple: 'rung', spanish: 'sonar, llamar', explanation: 'Hacer que un teléfono o timbre suene.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'rise', pastSimple: 'rose', pastParticiple: 'risen', spanish: 'elevarse', explanation: 'Moverse hacia arriba; el sol lo hace cada mañana.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'run', pastSimple: 'ran', pastParticiple: 'run', spanish: 'correr', explanation: 'Moverse rápidamente con los pies.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'saw', pastSimple: 'sawed', pastParticiple: 'sawn/sawed', spanish: 'serrar', explanation: 'Cortar madera con una sierra.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'say', pastSimple: 'said', pastParticiple: 'said', spanish: 'decir', explanation: 'Expresar algo con palabras.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'see', pastSimple: 'saw', pastParticiple: 'seen', spanish: 'ver', explanation: 'Percibir con los ojos.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'seek', pastSimple: 'sought', pastParticiple: 'sought', spanish: 'buscar', explanation: 'Intentar encontrar o conseguir algo (más formal).', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'sell', pastSimple: 'sold', pastParticiple: 'sold', spanish: 'vender', explanation: 'Dar algo a cambio de dinero.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'send', pastSimple: 'sent', pastParticiple: 'sent', spanish: 'enviar', explanation: 'Hacer que algo llegue a otro lugar (una carta, un email).', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'set', pastSimple: 'set', pastParticiple: 'set', spanish: 'establecer', explanation: 'Poner algo en un lugar; configurar (una alarma).', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'sew', pastSimple: 'sewed', pastParticiple: 'sewn/sewed', spanish: 'coser', explanation: 'Unir tela con hilo y aguja.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'shake', pastSimple: 'shook', pastParticiple: 'shaken', spanish: 'agitar', explanation: 'Mover algo rápidamente de un lado a otro.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'shed', pastSimple: 'shed', pastParticiple: 'shed', spanish: 'derramar', explanation: 'Dejar caer (lágrimas, hojas de un árbol).', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'shine', pastSimple: 'shone', pastParticiple: 'shone', spanish: 'brillar', explanation: 'Producir o reflejar luz.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'shoot', pastSimple: 'shot', pastParticiple: 'shot', spanish: 'disparar', explanation: 'Lanzar una bala desde un arma; sacar una foto.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'show', pastSimple: 'showed', pastParticiple: 'shown', spanish: 'mostrar', explanation: 'Dejar que alguien vea algo.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'shrink', pastSimple: 'shrank', pastParticiple: 'shrunk', spanish: 'encoger(se)', explanation: 'Hacerse más pequeño.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'shut', pastSimple: 'shut', pastParticiple: 'shut', spanish: 'cerrar', explanation: 'Mover algo para cubrir una abertura (una puerta, los ojos).', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'sing', pastSimple: 'sang', pastParticiple: 'sung', spanish: 'cantar', explanation: 'Producir música con la voz.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'sink', pastSimple: 'sank', pastParticiple: 'sunk', spanish: 'hundir(se)', explanation: 'Irse hacia el fondo del agua.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'sit', pastSimple: 'sat', pastParticiple: 'sat', spanish: 'sentarse', explanation: 'Poner el cuerpo en una silla o en el suelo.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'sleep', pastSimple: 'slept', pastParticiple: 'slept', spanish: 'dormir', explanation: 'Descansar con los ojos cerrados.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'slide', pastSimple: 'slid', pastParticiple: 'slid', spanish: 'deslizar(se)', explanation: 'Moverse suavemente sobre una superficie.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'smell', pastSimple: 'smelt/smelled', pastParticiple: 'smelt/smelled', spanish: 'oler', explanation: 'Percibir un aroma con la nariz.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'sow', pastSimple: 'sowed', pastParticiple: 'sown/sowed', spanish: 'sembrar', explanation: 'Plantar semillas en la tierra.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'speak', pastSimple: 'spoke', pastParticiple: 'spoken', spanish: 'hablar', explanation: 'Decir palabras; conversar.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'speed', pastSimple: 'sped', pastParticiple: 'sped', spanish: 'acelerar', explanation: 'Ir muy rápido.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'spell', pastSimple: 'spelt/spelled', pastParticiple: 'spelt/spelled', spanish: 'deletrear', explanation: 'Decir las letras de una palabra en orden.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'spend', pastSimple: 'spent', pastParticiple: 'spent', spanish: 'gastar/pasar', explanation: 'Usar dinero para comprar; pasar el tiempo.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'spill', pastSimple: 'spilt/spilled', pastParticiple: 'spilt/spilled', spanish: 'derramar', explanation: 'Dejar caer un líquido por accidente.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'spin', pastSimple: 'spun', pastParticiple: 'spun', spanish: 'girar', explanation: 'Rotar sobre un eje rápidamente.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'spit', pastSimple: 'spat', pastParticiple: 'spat', spanish: 'escupir', explanation: 'Expulsar saliva de la boca.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'split', pastSimple: 'split', pastParticiple: 'split', spanish: 'dividir', explanation: 'Separar algo en dos o más partes.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'spoil', pastSimple: 'spoilt/spoiled', pastParticiple: 'spoilt/spoiled', spanish: 'estropear', explanation: 'Arruinar algo; malcriar a un niño.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'spread', pastSimple: 'spread', pastParticiple: 'spread', spanish: 'extender(se)', explanation: 'Cubrir una superficie; difundir (noticias).', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'spring', pastSimple: 'sprang', pastParticiple: 'sprung', spanish: 'saltar', explanation: 'Moverse hacia arriba o adelante de repente.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'stand', pastSimple: 'stood', pastParticiple: 'stood', spanish: 'estar de pie', explanation: 'Sostenerse sobre los propios pies.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'steal', pastSimple: 'stole', pastParticiple: 'stolen', spanish: 'robar', explanation: 'Tomar algo que no es tuyo sin permiso.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'stick', pastSimple: 'stuck', pastParticiple: 'stuck', spanish: 'pegar, atascarse', explanation: 'Adherir con pegamento; quedarse inmóvil.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'sting', pastSimple: 'stung', pastParticiple: 'stung', spanish: 'picar', explanation: 'Causar dolor con un aguijón (abeja, escorpión).', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'stink', pastSimple: 'stank', pastParticiple: 'stunk', spanish: 'apestar', explanation: 'Tener un olor muy malo.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'strike', pastSimple: 'struck', pastParticiple: 'struck', spanish: 'golpear', explanation: 'Impactar con fuerza; hacer una huelga.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'swear', pastSimple: 'swore', pastParticiple: 'sworn', spanish: 'jurar', explanation: 'Hacer una promesa solemne; decir groserías.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'sweep', pastSimple: 'swept', pastParticiple: 'swept', spanish: 'barrer', explanation: 'Limpiar el suelo con una escoba.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'swell', pastSimple: 'swelled', pastParticiple: 'swollen', spanish: 'hinchar(se)', explanation: 'Aumentar de tamaño por acumulación de líquido.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'swim', pastSimple: 'swam', pastParticiple: 'swum', spanish: 'nadar', explanation: 'Moverse en el agua usando brazos y piernas.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'swing', pastSimple: 'swung', pastParticiple: 'swung', spanish: 'balancear(se)', explanation: 'Moverse hacia adelante y atrás desde un punto fijo.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'take', pastSimple: 'took', pastParticiple: 'taken', spanish: 'tomar/coger', explanation: 'Agarrar algo; llevar algo contigo.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'teach', pastSimple: 'taught', pastParticiple: 'taught', spanish: 'enseñar', explanation: 'Dar conocimiento o habilidades a alguien.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'tear', pastSimple: 'tore', pastParticiple: 'torn', spanish: 'rasgar', explanation: 'Romper papel, tela, etc., tirando de él.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'tell', pastSimple: 'told', pastParticiple: 'told', spanish: 'decir/contar', explanation: 'Comunicar información a alguien.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'think', pastSimple: 'thought', pastParticiple: 'thought', spanish: 'pensar', explanation: 'Usar la mente para considerar algo o tener una idea.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'throw', pastSimple: 'threw', pastParticiple: 'thrown', spanish: 'lanzar/tirar', explanation: 'Impulsar algo por el aire con la mano.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'thrust', pastSimple: 'thrust', pastParticiple: 'thrust', spanish: 'empujar', explanation: 'Empujar algo con fuerza y de repente.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'tread', pastSimple: 'trod', pastParticiple: 'trodden', spanish: 'pisar', explanation: 'Poner el pie sobre algo.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'understand', pastSimple: 'understood', pastParticiple: 'understood', spanish: 'entender', explanation: 'Comprender el significado de algo.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'wake', pastSimple: 'woke', pastParticiple: 'woken', spanish: 'despertar', explanation: 'Dejar de dormir.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'wear', pastSimple: 'wore', pastParticiple: 'worn', spanish: 'llevar puesto', explanation: 'Tener ropa, joyas, etc., en el cuerpo.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'weave', pastSimple: 'wove', pastParticiple: 'woven', spanish: 'tejer', explanation: 'Entrelazar hilos para hacer tela.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'weep', pastSimple: 'wept', pastParticiple: 'wept', spanish: 'llorar', explanation: 'Derramar lágrimas por tristeza.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'win', pastSimple: 'won', pastParticiple: 'won', spanish: 'ganar', explanation: 'Ser el mejor en una competición o juego.', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'wind', pastSimple: 'wound', pastParticiple: 'wound', spanish: 'dar cuerda', explanation: 'Girar una llave para hacer funcionar un mecanismo (reloj).', imageUrl: 'URL_AQUÍ' },
    // { infinitive: 'write', pastSimple: 'wrote', pastParticiple: 'written', spanish: 'escribir', explanation: 'Formar letras o palabras en una superficie.', imageUrl: 'URL_AQUÍ' }
]
// --- Generador de números pseudoaleatorios con semilla ---
function createSeededRandom(seed) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        const char = seed.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    
    let current = Math.abs(hash);
    return function() {
        current = (current * 1664525 + 1013904223) % Math.pow(2, 32);
        return current / Math.pow(2, 32);
    };
}

// --- Función determinista para mezclar array ---
function deterministicShuffle(array, seed) {
    const seededRandom = createSeededRandom(seed);
    const result = [...array];
    
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(seededRandom() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    
    return result;
}
function getCurrentVerbDay() {
    const today = new Date().toISOString().split('T')[0];
    
    // Verificar si hay un override manual para hoy
    const manualOverride = localStorage.getItem(`verbDay-${today}`);
    if (manualOverride) {
        return manualOverride;
    }
    
    // Si no hay override, usar la fecha actual
    return today;
}
function forceNewVerbDay() {
    const today = new Date().toISOString().split('T')[0];
    const timestamp = Date.now().toString();
    
    // Crear un "día artificial" con timestamp
    const artificialDay = `${today}-${timestamp}`;
    
    // Guardarlo para este día específico
    localStorage.setItem(`verbDay-${today}`, artificialDay);
    
    console.log('🔄 Forzando nuevo día de verbos:', artificialDay);
    
    return artificialDay;
}
// --- Función principal para generar verbos diarios ---
function generateDailyVerbs(forceReset = false) {
    let verbDay;
    
    if (forceReset) {
        verbDay = forceNewVerbDay();
    } else {
        verbDay = getCurrentVerbDay();
    }
    
    console.log('📅 Día de verbos:', verbDay);
    
    // Filtrar verbos activos
    const activeVerbs = ALL_VERBS.filter(verb => 
        verb.imageUrl && !verb.imageUrl.includes('URL_AQUÍ')
    );
    
    // Mezclar con la semilla del día de verbos
    const shuffledVerbs = deterministicShuffle(activeVerbs, verbDay);
    
    // Tomar los primeros 5
    const dailyVerbs = shuffledVerbs.slice(0, 5);
    
    console.log('📚 Verbos generados:', dailyVerbs.map(v => v.infinitive));
    
    return dailyVerbs;
}
// --- Función para limpiar verbos de días anteriores ---
function cleanOldDailyVerbs() {
    const keys = Object.keys(localStorage);
    const today = new Date().toISOString().split('T')[0];
    
    keys.forEach(key => {
        if (key.startsWith('dailyVerbs-') || 
            (key.startsWith('verbDay-') && !key.includes(today))) {
            localStorage.removeItem(key);
            console.log('🧹 Limpiando:', key);
        }
    });
}
// --- Función para verificar cambio de día ---
function checkDailyUpdate() {
    const today = new Date().toISOString().split('T')[0];
    const lastCheck = localStorage.getItem('lastDailyCheck');
    
    if (lastCheck !== today) {
        // Nuevo día natural - limpiar overrides del día anterior
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        localStorage.removeItem(`verbDay-${yesterday}`);
        localStorage.setItem('lastDailyCheck', today);
        
        console.log('🌅 Nuevo día detectado, limpiando datos antiguos...');
        cleanOldDailyVerbs();
    }
    
    return generateDailyVerbs(false);
}
// --- Función para obtener info de debug ---
function getDebugInfo() {
    const today = new Date().toISOString().split('T')[0];
    const verbDay = getCurrentVerbDay();
    
    return {
        today,
        verbDay,
        isManualOverride: verbDay !== today,
        lastCheck: localStorage.getItem('lastDailyCheck'),
        verbs: generateDailyVerbs(false).map(v => v.infinitive)
    };
}
// --- Generar DAILY_VERBS inicial ---
const DAILY_VERBS = checkDailyUpdate();
export { ALL_VERBS, DAILY_VERBS, generateDailyVerbs, checkDailyUpdate, getDebugInfo };