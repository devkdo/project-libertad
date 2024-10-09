const Q_NAME = "Nombre y Apellidos - Nomes e Sobrenomes - First and Last Names";
const Q_EMAIL = "Email Address";
const Q_LEVEL =
  "¿Cuál es su nivel de inglés? Qual é o seu nível de inglês? What is your level of English?";
const Q_DAY =
  "Which night do you prefer? ¿Qué noche prefiere? Qual noite você prefere?";

const A_LEVEL1 =
  "I don't speak or understand any English. No hablo ni entiendo nada de inglés. Eu não falo nem entendo nenhum inglês.";
const A_LEVEL2 =
  "I speak and understand a little bit of English. Hablo y entiendo un poco de inglés. Falo e entendo um pouco de inglês.";
const A_LEVEL3 =
  "I am comfortable having short conversations in English. Estoy cómodo para tener conversaciones cortas en inglés. Sinto-me confortável em conversas curtas em inglês.";
const A_DAYMON = "Monday - lunes - segunda-feira";
const A_DAYTUE = "Tuesday - martes - terça-feira";

function processXLS() {
  const fileInput = document.getElementById("input-file");
  const file = fileInput.files[0];

  console.log(file);

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const fileData = new Uint8Array(e.target.result);
      const workbook = XLSX.read(fileData, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const headers = jsonData[0];
      const splitData = jsonData.slice(1).map((row) => {
        let obj = {};
        headers.forEach((header, index) => {
          if (
            header === Q_NAME ||
            header === Q_EMAIL ||
            header === Q_DAY ||
            header === Q_LEVEL
          ) {
            obj[header] = row[index];
          }
        });
        return obj;
      });

      const mon1 = [];
      const mon2 = [];
      const monAny = [];
      const tue1 = [];
      const tue2 = [];
      const tueAny = [];

      splitData.forEach((student) => {
        const name = student[Q_NAME];
        const email = student[Q_EMAIL];
        const day = student[Q_DAY];
        const level = student[Q_LEVEL];
        const studentInfo = { name, email };

        switch (day) {
          case A_DAYMON:
            if (level === A_LEVEL1) mon1.push(studentInfo);
            else if (level === A_LEVEL3) mon2.push(studentInfo);
            else monAny.push(studentInfo);
            break;

          case A_DAYTUE:
            if (level === A_LEVEL1) tue1.push(studentInfo);
            else if (level === A_LEVEL3) tue2.push(studentInfo);
            else tueAny.push(studentInfo);
            break;

          default:
            break;
        }
      });
      evenDistribute(monAny, mon1, mon2);
      evenDistribute(tueAny, tue1, tue2);
      // displayLists(mon1, mon2, tue1, tue2);
    };
    reader.readAsArrayBuffer(file);
  } else {
    alert("Please upload an XLS/XLSX file.");
  }
}

function evenDistribute(anyList, l1, l2) {
  if (anyList.length == 0) return;

  const list1 = l1.slice();
  const list2 = l2.slice();
  const listAny = anyList.slice();
  const lengthListAny = listAny.length;

  console.log(
    "START LENGTHS",
    "sizeAny",
    listAny.length,
    lengthListAny,
    "size1",
    list1.length,
    "size2",
    list2.length
  );

  let loop = 0;
  let done = false;
  while (!done || listAny.length > 0) {
    // default: case 0: same length
    // split listany and add half to each

    // case 1: first list is bigger
    // splice listany and add difference to second list
    // split remaining listany between both lists

    // case 2: second list is bigger
    // splice listany and add difference to first list
    // split remaining listany between both lists

    let diff = list1.length - list2.length;
    let maxIndex =
      Math.abs(diff) < listAny.length ? diff - 1 : listAny.length - 1;
    if (maxIndex == 0) maxIndex = 1;
    // console.log("diff", diff);
    // console.log("maxIndex", maxIndex);

    if (diff > 0) {
      list2.push(...listAny.splice(0, maxIndex));
    } else if (diff < 0) {
      list1.push(...listAny.splice(0, maxIndex));
    } else {
      list1.push(...listAny.splice(0, listAny.length / 2));
      list2.push(...listAny.splice(0, listAny.length));
      done = true;
    }
    loop++;
  }
  console.log("loop count", loop);
  console.log(
    "FINAL LENGTHS",
    "sizeAny",
    listAny.length,
    "size1",
    list1.length,
    "size2",
    list2.length
  );
}

function displayLists(l1, l2, l3, l4) {
  const output = document.getElementById("output");
  output.innerHTML = `
        <h3>Monday Beginner</h3><pre>${JSON.stringify(l1, null, 2)}</pre>
        <h3>Monday Non-Beginner</h3><pre>${JSON.stringify(l2, null, 2)}</pre>
        <h3>Tuesday Beginner</h3><pre>${JSON.stringify(l3, null, 2)}</pre>
        <h3>Tuesday Non-Beginner</h3><pre>${JSON.stringify(l4, null, 2)}</pre>
      `;
}

// document.getElementById("input-file").addEventListener("change", processXLS);
document.getElementById("btn-sort").addEventListener("click", processXLS);
