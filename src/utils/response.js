/**
 * Response
 * 
 * @param {Boolean} status response status
 * @param {string} msg response message
 * @param {any} data response data
 * 
 * @returns {Object} 
 */
export default (status, data = null, msg = null) => {
    if (status)
        return {
            status,
            msg,
            data
        }
    else {
        return {
            status,
            error: data
        }
    }
}