//methods 
const generateUniqueUserId = (email) => {
    const emailHash = crypto.createHash('sha256').update(email).digest('hex').substring(0, 8);

    const now = new Date();
    const yy = String(now.getFullYear()).slice(2, 4);
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const datePart = yy + mm + dd;

    const randomChar = crypto.randomBytes(1).toString('hex').substring(0, 1);

    return `${emailHash}${datePart}${randomChar}`;
};






module.exports = {generateUniqueUserId}