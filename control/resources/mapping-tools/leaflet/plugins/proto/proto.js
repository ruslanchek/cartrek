L.Polyline.prototype.length_in_meters = function () {
    var metros_totales_ruta = 0,
        coordenadas_iniciales = null,
        array_coordenadas_polilinea = this._latlngs;

    for (i = 0; i < array_coordenadas_polilinea.length - 1; i++) {
        coordenadas_iniciales = array_coordenadas_polilinea[i];
        metros_totales_ruta  += coordenadas_iniciales.distanceTo(array_coordenadas_polilinea[i + 1]);

    }

    //redondear los metros de la ruta...
    metros_totales_ruta = metros_totales_ruta.toFixed();

    return metros_totales_ruta;
}