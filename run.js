import fs from 'fs';
const files = fs.readdirSync('./public/images/stocks');
const result = [];
for (const file of files) {
    let typeId = 1;
    if (file.startsWith('chu-hy')) typeId = 4;
    else if (file.startsWith('hoa-cuoi')) typeId = 3;
    else if (file.startsWith('nhan-vat')) typeId = 2;
    else if (file.startsWith('trai-tim')) typeId = 5;
    else if (file.startsWith('yeu-to-dam')) typeId = 1;

    result.push({
        url: 'stocks/' + file,
        id_image_type: typeId,
        id_min_package: 1,
        id_user: null,
        createdAt: 'NEW_DATE()',
        updatedAt: 'NEW_DATE()'
    });
}
let out = JSON.stringify(result, null, 2).replace(/\"NEW_DATE\(\)\"/g, 'new Date()');
fs.writeFileSync('temp_stocks.txt', out);
