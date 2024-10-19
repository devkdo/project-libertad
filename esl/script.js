import constants from './constants.js';

document.getElementById("btn-sort").addEventListener("click", processXLSClasses);
document.getElementById("btn-emails").addEventListener("click", processXLSEmails);
document.getElementById("btn-students").addEventListener("click", processXLSEmailsAndPhone);
// document.getElementById("btn-dl").addEventListener("click", processAttendance);

function callProcess(){
  resetOutput();
  const fileInput = document.getElementById("input-file");
  const { mondays, tuesdays } = processXLS(fileInput);
  displayLists(mondays.beg, mondays.nonbeg, tuesdays.beg, tuesdays.nonbeg);
  console.log("result", mondays, tuesdays);
}

function processXLS(fileInput) {
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
                      header === constants.Q_NAME ||
                      header === constants.Q_EMAIL ||
                      header === constants.Q_DAY ||
                      header === constants.Q_LEVEL
                  ) {
                      obj[header] = row[index];
                  }
              });
              return obj;
          });

          const mon1 = [], mon2 = [], monAny = [];
          const tue1 = [], tue2 = [], tueAny = [];

          splitData.forEach((student) => {
              const name = student[constants.Q_NAME];
              const email = student[constants.Q_EMAIL];
              const day = student[constants.Q_DAY];
              const level = student[constants.Q_LEVEL];
              const studentInfo = { name, email };

              switch (day) {
                  case constants.A_DAYMON:
                      if (level === constants.A_LEVEL1) mon1.push(studentInfo);
                      else if (level === constants.A_LEVEL3) mon2.push(studentInfo);
                      else monAny.push(studentInfo);
                      break;
                  case constants.A_DAYTUE:
                      if (level === constants.A_LEVEL1) tue1.push(studentInfo);
                      else if (level === constants.A_LEVEL3) tue2.push(studentInfo);
                      else tueAny.push(studentInfo);
                      break;
                  default:
                      break;
              }
          });

          const mondays = evenDistribute(monAny, mon1, mon2);
          const tuesdays = evenDistribute(tueAny, tue1, tue2);

          // Return the lists for Mondays and Tuesdays
          return { mondays, tuesdays };
      };
      reader.readAsArrayBuffer(file);
  } else {
      alert("Please upload an XLS/XLSX file.");
  }
}

function processXLSEmails() {
  resetOutput();
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
            header === constants.Q_NAME ||
            header === constants.Q_EMAIL ||
            header === constants.Q_DAY ||
            header === constants.Q_LEVEL
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
        const name = student[constants.Q_NAME];
        const email = student[constants.Q_EMAIL];
        const day = student[constants.Q_DAY];
        const level = student[constants.Q_LEVEL];
        const studentInfo = { name, email };

        switch (day) {
          case constants.A_DAYMON:
            if (level === constants.A_LEVEL1) mon1.push(studentInfo);
            else if (level === constants.A_LEVEL3) mon2.push(studentInfo);
            else monAny.push(studentInfo);
            break;

          case constants.A_DAYTUE:
            if (level === constants.A_LEVEL1) tue1.push(studentInfo);
            else if (level === constants.A_LEVEL3) tue2.push(studentInfo);
            else tueAny.push(studentInfo);
            break;

          default:
            break;
        }
      });
      const mondays = evenDistribute(monAny, mon1, mon2);
      const tuesdays = evenDistribute(tueAny, tue1, tue2);
      displayEmails(mondays.beg, mondays.nonbeg, tuesdays.beg, tuesdays.nonbeg);
      // createExcel(mondays.beg, mondays.nonbeg, tuesdays.beg, tuesdays.nonbeg);
      
      // result = (new Array([mondays, tuesdays]));
      // console.log("result", result);
    };
    reader.readAsArrayBuffer(file);
    
  } else {
    alert("Please upload an XLS/XLSX file.");
  }
}
function processXLSEmailsAndPhone() {
  resetOutput();
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
            header === constants.Q_NAME ||
            header === constants.Q_EMAIL ||
            header === constants.Q_PHONE ||
            header === constants.Q_DAY ||
            header === constants.Q_LEVEL
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
        const name = student[constants.Q_NAME];
        const email = student[constants.Q_EMAIL];
        const phone = student[constants.Q_PHONE];
        const day = student[constants.Q_DAY];
        const level = student[constants.Q_LEVEL];
        const studentInfo = { name, email, phone };

        switch (day) {
          case constants.A_DAYMON:
            if (level === constants.A_LEVEL1) mon1.push(studentInfo);
            else if (level === constants.A_LEVEL3) mon2.push(studentInfo);
            else monAny.push(studentInfo);
            break;

          case constants.A_DAYTUE:
            if (level === constants.A_LEVEL1) tue1.push(studentInfo);
            else if (level === constants.A_LEVEL3) tue2.push(studentInfo);
            else tueAny.push(studentInfo);
            break;

          default:
            break;
        }
      });
      const mondays = evenDistribute(monAny, mon1, mon2);
      const tuesdays = evenDistribute(tueAny, tue1, tue2);
      displayStudentInfo(mondays.beg, mondays.nonbeg, tuesdays.beg, tuesdays.nonbeg);
      // createExcel(mondays.beg, mondays.nonbeg, tuesdays.beg, tuesdays.nonbeg);
      
      // result = (new Array([mondays, tuesdays]));
      // console.log("result", result);
    };
    reader.readAsArrayBuffer(file);
    
  } else {
    alert("Please upload an XLS/XLSX file.");
  }
}
function processXLSClasses() {
  resetOutput();
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
            header === constants.Q_NAME ||
            header === constants.Q_EMAIL ||
            header === constants.Q_DAY ||
            header === constants.Q_LEVEL
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
        const name = student[constants.Q_NAME];
        const email = student[constants.Q_EMAIL];
        const day = student[constants.Q_DAY];
        const level = student[constants.Q_LEVEL];
        const studentInfo = { name, email };

        switch (day) {
          case constants.A_DAYMON:
            if (level === constants.A_LEVEL1) mon1.push(studentInfo);
            else if (level === constants.A_LEVEL3) mon2.push(studentInfo);
            else monAny.push(studentInfo);
            break;

          case constants.A_DAYTUE:
            if (level === constants.A_LEVEL1) tue1.push(studentInfo);
            else if (level === constants.A_LEVEL3) tue2.push(studentInfo);
            else tueAny.push(studentInfo);
            break;

          default:
            break;
        }
      });
      const mondays = evenDistribute(monAny, mon1, mon2);
      const tuesdays = evenDistribute(tueAny, tue1, tue2);
      displayLists(mondays.beg, mondays.nonbeg, tuesdays.beg, tuesdays.nonbeg);
      // createExcel(mondays.beg, mondays.nonbeg, tuesdays.beg, tuesdays.nonbeg);
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
      Math.abs(diff) < listAny.length ? Math.abs(diff) - 1 : listAny.length - 1;
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
function getStudentInfoString(list){
  let names = "";
  let emails = "";
  let numbers = "";
  let infoString = "";
  for(let student of list.values()){
    const entry = `${student.name}, ${student.email}, ${student.phone}<br>`;
    names += "\n" + student.name;
    emails += "\n" + student.email;
    numbers += "\n" + student.phone; 
    infoString += entry; 
  }
  console.log(names);
  console.log(emails);
  console.log(numbers);
  console.log(infoString);
  return infoString;
}

function displayStudentInfo(l1, l2, l3, l4) {
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
  outputHeaders1.innerHTML = `<h3>Student Info</h3><b>Monday Beginner (${l1.length})</b>`;
  outputHeaders2.innerHTML = `<b>Monday NonBeginner (${l2.length})</b>`;
  outputHeaders3.innerHTML = `<b>Tuesday Beginner (${l3.length})</b>`;
  outputHeaders4.innerHTML = `<b>Tuesday NonBeginner (${l4.length})</b>`;
  console.log(outputHeaders1.textContent);
  output1.innerHTML = getStudentInfoString(l1);
  console.log(outputHeaders2.textContent);
  output2.innerHTML = getStudentInfoString(l2);
  console.log(outputHeaders3.textContent);
  output3.innerHTML = getStudentInfoString(l3);
  console.log(outputHeaders4.textContent);
  output4.innerHTML = getStudentInfoString(l4);
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
  outputHeaders1.innerHTML = `<h3>Mailing List</h3><b>Monday Beginner (${l1.length})</b>`;
  outputHeaders2.innerHTML = `<b>Monday NonBeginner (${l2.length})</b>`;
  outputHeaders3.innerHTML = `<b>Tuesday Beginner (${l3.length})</b>`;
  outputHeaders4.innerHTML = `<b>Tuesday NonBeginner (${l4.length})</b>`;
  output1.textContent += getEmailString(l1);
  output2.textContent += getEmailString(l2);
  output3.textContent += getEmailString(l3);
  output4.textContent += getEmailString(l4);
}

function displayLists(l1, l2, l3, l4) {
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
  outputHeaders1.innerHTML = `<h3>Monday Beginner (${l1.length})</h3>`;
  output1.innerHTML = `<pre>${JSON.stringify(l1,null,2)}</pre>`;
  outputHeaders2.innerHTML = `<h3>Monday Non-Beginner (${l2.length})</h3>`;
  output2.innerHTML = `<pre>${JSON.stringify(    l2,    null,    2  )}</pre>`;
  outputHeaders3.innerHTML = `<h3>Tuesday Beginner (${l3.length})</h3>`;
  output3.innerHTML = `<pre>${JSON.stringify(    l3,    null,    2  )}</pre>`
  outputHeaders4.innerHTML = `<h3>Tuesday Non-Beginner (${l4.length})</h3>`;
  output4.innerHTML = `<pre>${JSON.stringify(l4,null,2)}</pre>`;
}

function resetOutput(){
  // const outputContainer = document.getElementById("output-container");
  // outputContainer.classList.remove("section-green");
  
  const outputHeaders1 = document.getElementById("output-headers1");
  const outputHeaders2 = document.getElementById("output-headers2");
  const outputHeaders3 = document.getElementById("output-headers3");
  const outputHeaders4 = document.getElementById("output-headers4");
  const output1 = document.getElementById("output1");
  const output2 = document.getElementById("output2");
  const output3 = document.getElementById("output3");
  const output4 = document.getElementById("output4");
  outputHeaders1.innerHTML = ``;
  outputHeaders2.innerHTML = ``;
  outputHeaders3.innerHTML = ``;
  outputHeaders4.innerHTML = ``;
  output1.textContent = ``;
  output2.textContent = ``;
  output3.textContent = ``;
  output4.textContent = ``;
}


function createExcel(data1, data2, data3, data4) {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Create worksheets for each data array
    createWorksheet(data1, 'Class1');
    createWorksheet(data2, 'Class2');
    createWorksheet(data3, 'Class3');
    createWorksheet(data4, 'Class4');
  
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });

    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendance.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  
    // Write the workbook to a file
    // XLSX.writeFile(workbook, 'attendance.xlsx');
}

 function createWorksheet(data, sheetName) {
   const worksheetData = data.map(item => [item.name, item.email]);
   const worksheet = XLSX.utils.aoa_to_sheet([['Name', 'Email'], ...worksheetData]);
   XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
 }

function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf); // view the buffer as array of 8-bit unsigned int
    for (let i = 0; i < s.length; i++) {
        view[i] = s.charCodeAt(i) & 0xFF; // Assign each character's code to the buffer
    }
    return buf;
}
