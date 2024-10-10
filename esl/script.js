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

// document.getElementById("btn-sort").addEventListener("click", getClasses);
// document.getElementById("btn-emails").addEventListener("click", getEmails);
document.getElementById("btn-emails").addEventListener("click", processXLS);

// function getEmails(){
//   let result=[];
//   processXLS(result);
//   console.log("processed result", result);
  
//   const mondays = result[0];
//   const tuesdays = result[1];
//   displayEmails(mondays.beg, mondays.nonbeg, tuesdays.beg, tuesdays.nonbeg);
  
// }
// function getClasses(){
//   const result = processXLS();
//   const mondays = result[0];
//   const tuesdays = result[1];
//   displayLists(mondays.beg, mondays.nonbeg, tuesdays.beg, tuesdays.nonbeg);
// }

function processXLS(result) {
  const fileInput = document.getElementById("input-file");
  const file = fileInput.files[0];

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
      const mondays = evenDistribute(monAny, mon1, mon2);
      const tuesdays = evenDistribute(tueAny, tue1, tue2);
      displayEmails(mondays.beg, mondays.nonbeg, tuesdays.beg, tuesdays.nonbeg);
      // result = (new Array([mondays, tuesdays]));
      // console.log("result", result);
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

  console.log(`Registered: beginner (${list1.length}), intermediate (${listAny.length}), advanced (${list2.length})`);

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
  
 console.log(`Distributed: beginner (${list1.length}), intermediate (${listAny.length}), nonbeginner (${list2.length})`);
  
  return { beg: list1, nonbeg: list2 };
}

function getEmailString(list){
  let emails = "";
  for(let student of list.values()){
    const entry = `"${student.name}"<${student.email}>,`;
    emails += entry;
  }
  return emails;
}

function displayEmails(l1, l2, l3, l4) {
  const outputContainer = document.getElementById("output-container");
  outputContainer.classList.add("section-green");
  
  const outputHeaders1 = document.getElementById("output-headers1");
  const outputHeaders2 = document.getElementById("output-headers2");
  const outputHeaders3 = document.getElementById("output-headers3");
  const outputHeaders4 = document.getElementById("output-headers4");
  const output1 = document.getElementById("output1");
  const output2 = document.getElementById("output2");
  const output3 = document.getElementById("output3");
  const output4 = document.getElementById("output4");
  outputHeaders1.innerHTML = `<h3>Mailing list</h3><b>Monday Beginner (${l1.length})</b>`;
  outputHeaders2.innerHTML = `<h3>Mailing list</h3><b>Monday NonBeginner (${l2.length})</b>`;
  outputHeaders3.innerHTML = `<h3>Mailing list</h3><b>Tuesday Beginner (${l3.length})</b>`;
  outputHeaders4.innerHTML = `<h3>Mailing list</h3><b>Tuesday NonBeginner (${l4.length})</b>`;
  output1.textContent += getEmailString(l1);
  output2.textContent += getEmailString(l2);
  output3.textContent += getEmailString(l3);
  output4.textContent += getEmailString(l4);
}

function displayLists(l1, l2, l3, l4) {
  const output = document.getElementById("output");
  output.innerHTML = `<div class="section-green">
        <h3>Monday Beginner (${l1.length})</h3><pre>${JSON.stringify(
    l1,
    null,
    2
  )}</pre></div>
        <div class="section-green"><h3>Monday Non-Beginner (${l2.length})</h3><pre>${JSON.stringify(
    l2,
    null,
    2
  )}</pre></div>
        <div class="section-green"><h3>Tuesday Beginner (${l3.length})</h3><pre>${JSON.stringify(
    l3,
    null,
    2
  )}</pre></div>
        <div class="section-green"><h3>Tuesday Non-Beginner (${l4.length})</h3><pre>${JSON.stringify(
    l4,
    null,
    2
  )}</pre></div>
      `;
}

