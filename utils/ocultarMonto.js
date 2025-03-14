/**
 * Oculta el monto si supera el límite especificado
 * @param {number} monto - Monto original
 * @param {number} limite - Límite a partir del cual se oculta (20000)
 * @returns {string|number} - Monto original o texto indicando que está oculto
 */
exports.ocultarMonto = (monto, limite = 20000) => {
    return monto > limite ? "Monto Confidencial" : monto;
  };
  
  /**
   * Transforma una transacción para ocultar el monto
   * @param {Object} transaccion - Objeto de transacción
   * @returns {Object} - Transacción con monto posiblemente ocultado
   */
  exports.transformarTransaccion = (transaccion) => {
    if (!transaccion) return transaccion;
    
    const transaccionModificada = { ...transaccion };
    
    if (transaccion.Monto > 20000) {
      transaccionModificada.Monto = "Monto Confidencial";
      transaccionModificada.MontoOculto = true;
    }
    
    return transaccionModificada;
  };