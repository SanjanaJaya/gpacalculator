// Global variables to store student data
let studentData = {
    name: '',
    degree: '',
    batch: '',
    currentYear: '',
    includeFirstYear: false,
    modules: {
        year1: { semester1: [], semester2: [] },
        year2: { semester1: [], semester2: [] },
        year3: { semester1: [], semester2: [] }
    }
};

let currentStep = 1;
const totalSteps = 4;

// DOM elements
const progressFill = document.getElementById('progressFill');
const steps = document.querySelectorAll('.step');
const formSteps = document.querySelectorAll('.form-step');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    updateProgress();
});

// Navigation functions
function nextStep() {
    if (validateCurrentStep()) {
        if (currentStep < totalSteps) {
            // Handle step-specific logic
            if (currentStep === 1) {
                saveStudentInfo();
            } else if (currentStep === 2) {
                saveYearSelection();
                generateModuleForms();
            }
            
            // Animate transition
            const currentStepElement = document.getElementById(`step${currentStep}`);
            const nextStepElement = document.getElementById(`step${currentStep + 1}`);
            
            currentStepElement.classList.add('slide-out-left');
            
            setTimeout(() => {
                currentStepElement.classList.remove('active', 'slide-out-left');
                nextStepElement.classList.add('active', 'slide-in-right');
                currentStep++;
                updateProgress();
                
                setTimeout(() => {
                    nextStepElement.classList.remove('slide-in-right');
                }, 400);
            }, 400);
        }
    }
}

function prevStep() {
    if (currentStep > 1) {
        const currentStepElement = document.getElementById(`step${currentStep}`);
        const prevStepElement = document.getElementById(`step${currentStep - 1}`);
        
        currentStepElement.classList.add('slide-out-right');
        
        setTimeout(() => {
            currentStepElement.classList.remove('active', 'slide-out-right');
            prevStepElement.classList.add('active', 'slide-in-left');
            currentStep--;
            updateProgress();
            
            setTimeout(() => {
                prevStepElement.classList.remove('slide-in-left');
            }, 400);
        }, 400);
    }
}

function updateProgress() {
    const progressPercentage = (currentStep / totalSteps) * 100;
    progressFill.style.width = `${progressPercentage}%`;
    
    // Update step indicators
    steps.forEach((step, index) => {
        if (index + 1 <= currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

// Validation functions
function validateCurrentStep() {
    switch (currentStep) {
        case 1:
            return validateStudentInfo();
        case 2:
            return validateYearSelection();
        case 3:
            return validateModules();
        default:
            return true;
    }
}

function validateStudentInfo() {
    const name = document.getElementById('studentName').value.trim();
    const degree = document.getElementById('degree').value.trim();
    const batch = document.getElementById('batch').value.trim();
    
    if (!name || !degree || !batch) {
        showAlert('Please fill in all required fields', 'error');
        return false;
    }
    return true;
}

function validateYearSelection() {
    const currentYear = document.getElementById('currentYear').value;
    if (!currentYear) {
        showAlert('Please select your current year', 'error');
        return false;
    }
    return true;
}

function validateModules() {
    const moduleInputs = document.querySelectorAll('.module-inputs input');
    let isValid = true;
    
    moduleInputs.forEach(input => {
        if (input.type === 'text' && !input.value.trim()) {
            isValid = false;
        } else if (input.type === 'number') {
            const value = parseFloat(input.value);
            if (isNaN(value) || value < 0 || value > 100) {
                isValid = false;
            }
        }
    });
    
    if (!isValid) {
        showAlert('Please fill in all module names and marks (0-100)', 'error');
    }
    
    return isValid;
}

// Data saving functions
function saveStudentInfo() {
    studentData.name = document.getElementById('studentName').value.trim();
    studentData.degree = document.getElementById('degree').value.trim();
    studentData.batch = document.getElementById('batch').value.trim();
}

function saveYearSelection() {
    studentData.currentYear = document.getElementById('currentYear').value;
    studentData.includeFirstYear = document.getElementById('includeFirstYear').checked;
}

// Year selection handler
function handleYearChange() {
    const currentYear = document.getElementById('currentYear').value;
    const firstYearOption = document.getElementById('firstYearOption');
    
    // Show first year option for 2nd year, 3rd year, and graduated students
    if (currentYear && (currentYear === '2' || currentYear === '3' || currentYear === 'graduated')) {
        firstYearOption.style.display = 'block';
        firstYearOption.style.animation = 'fadeInSlide 0.5s ease-out';
    } else {
        firstYearOption.style.display = 'none';
    }
}

// Module form generation
function generateModuleForms() {
    const moduleContainer = document.getElementById('moduleContainer');
    moduleContainer.innerHTML = '';
    
    const currentYear = studentData.currentYear;
    const includeFirstYear = studentData.includeFirstYear;
    
    // Generate forms based on year and preferences
    if (includeFirstYear && (currentYear === '3' || currentYear === 'graduated')) {
        generateYearForm('year1', 'First Year (Reference Only)', false);
    }
    
    if (currentYear === '2' || currentYear === '3' || currentYear === 'graduated') {
        generateYearForm('year2', 'Second Year (40% weight)', true);
    }
    
    if (currentYear === '3' || currentYear === 'graduated') {
        generateYearForm('year3', 'Third Year (60% weight)', true);
    }
}

function generateYearForm(yearKey, yearTitle, isGPAYear) {
    const moduleContainer = document.getElementById('moduleContainer');
    
    const yearSection = document.createElement('div');
    yearSection.className = 'year-section';
    yearSection.innerHTML = `
        <h3 class="year-title">
            <i class="fas fa-calendar-alt"></i>
            ${yearTitle}
        </h3>
        ${generateSemesterForm(yearKey, 'semester1', 'First Semester')}
        ${generateSemesterForm(yearKey, 'semester2', 'Second Semester')}
    `;
    
    moduleContainer.appendChild(yearSection);
    
    // Add event listeners for module count inputs
    const countInputs = yearSection.querySelectorAll('.module-count-input input');
    countInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            const [year, semester] = e.target.dataset.key.split('-');
            generateModuleInputs(year, semester, parseInt(e.target.value));
        });
    });
}

function generateSemesterForm(yearKey, semesterKey, semesterTitle) {
    return `
        <div class="semester-section">
            <h4 class="semester-title">
                <i class="fas fa-book-open"></i>
                ${semesterTitle}
            </h4>
            <div class="module-count-input">
                <label>
                    <i class="fas fa-list-ol"></i>
                    Number of modules:
                </label>
                <input type="number" min="1" max="10" data-key="${yearKey}-${semesterKey}" 
                       placeholder="Enter number of modules">
            </div>
            <div class="module-inputs" id="${yearKey}-${semesterKey}-inputs">
                <!-- Module inputs will be generated here -->
            </div>
        </div>
    `;
}

function generateModuleInputs(year, semester, count) {
    const container = document.getElementById(`${year}-${semester}-inputs`);
    container.innerHTML = '';
    
    for (let i = 1; i <= count; i++) {
        const moduleRow = document.createElement('div');
        moduleRow.className = 'module-input-row';
        moduleRow.innerHTML = `
            <div class="form-group">
                <input type="text" placeholder="Module ${i} name" 
                       data-key="${year}-${semester}-${i}-name" required>
            </div>
            <div class="form-group">
                <input type="number" min="0" max="100" step="0.01" 
                       placeholder="Mark %" data-key="${year}-${semester}-${i}-mark" required>
            </div>
        `;
        container.appendChild(moduleRow);
    }
    
    // Add animation
    container.style.animation = 'fadeInSlide 0.5s ease-out';
}

// GPA Calculation
function calculateGPA() {
    if (!validateModules()) return;
    
    // Save all module data
    saveModuleData();
    
    // Calculate GPA
    const gpaResult = computeGPA();
    
    // Display results
    displayResults(gpaResult);
    
    // Move to results step
    const currentStepElement = document.getElementById(`step${currentStep}`);
    const resultsStepElement = document.getElementById('step4');
    
    currentStepElement.classList.add('slide-out-left');
    
    setTimeout(() => {
        currentStepElement.classList.remove('active', 'slide-out-left');
        resultsStepElement.classList.add('active', 'slide-in-right');
        currentStep = 4;
        updateProgress();
        
        setTimeout(() => {
            resultsStepElement.classList.remove('slide-in-right');
        }, 400);
    }, 400);
}

function saveModuleData() {
    const moduleInputs = document.querySelectorAll('.module-inputs input');
    
    moduleInputs.forEach(input => {
        const keyParts = input.dataset.key.split('-');
        const year = keyParts[0];
        const semester = keyParts[1];
        const moduleIndex = parseInt(keyParts[2]) - 1;
        const type = keyParts[3]; // 'name' or 'mark'
        
        if (!studentData.modules[year][semester][moduleIndex]) {
            studentData.modules[year][semester][moduleIndex] = {};
        }
        
        if (type === 'name') {
            studentData.modules[year][semester][moduleIndex].name = input.value.trim();
        } else if (type === 'mark') {
            studentData.modules[year][semester][moduleIndex].mark = parseFloat(input.value);
        }
    });
}

function computeGPA() {
    let totalWeightedMarks = 0;
    let totalWeight = 0;
    let year2Average = 0;
    let year3Average = 0;
    let year2ModuleCount = 0;
    let year3ModuleCount = 0;
    
    // Calculate Year 2 average
    if (studentData.modules.year2.semester1.length > 0 || studentData.modules.year2.semester2.length > 0) {
        let year2Total = 0;
        year2ModuleCount = studentData.modules.year2.semester1.length + studentData.modules.year2.semester2.length;
        
        [...studentData.modules.year2.semester1, ...studentData.modules.year2.semester2].forEach(module => {
            if (module && module.mark !== undefined) {
                year2Total += module.mark;
            }
        });
        
        year2Average = year2ModuleCount > 0 ? year2Total / year2ModuleCount : 0;
    }
    
    // Calculate Year 3 average
    if (studentData.modules.year3.semester1.length > 0 || studentData.modules.year3.semester2.length > 0) {
        let year3Total = 0;
        year3ModuleCount = studentData.modules.year3.semester1.length + studentData.modules.year3.semester2.length;
        
        [...studentData.modules.year3.semester1, ...studentData.modules.year3.semester2].forEach(module => {
            if (module && module.mark !== undefined) {
                year3Total += module.mark;
            }
        });
        
        year3Average = year3ModuleCount > 0 ? year3Total / year3ModuleCount : 0;
    }
    
    // Apply weights according to Plymouth University system
    if (year2ModuleCount > 0 && year3ModuleCount > 0) {
        // Both years completed (graduated student)
        totalWeightedMarks = (year2Average * 0.4) + (year3Average * 0.6);
        totalWeight = 1;
    } else if (year2ModuleCount > 0) {
        // Only year 2 completed (current 2nd year student)
        totalWeightedMarks = year2Average;
        totalWeight = 1;
    } else if (year3ModuleCount > 0) {
        // Only year 3 data (shouldn't happen, but handle gracefully)
        totalWeightedMarks = year3Average;
        totalWeight = 1;
    }
    
    const finalPercentage = totalWeight > 0 ? totalWeightedMarks : 0;
    const classification = getClassification(finalPercentage);
    
    return {
        finalPercentage: finalPercentage,
        year2Average: year2Average,
        year3Average: year3Average,
        classification: classification,
        isCompleted: year2ModuleCount > 0 && year3ModuleCount > 0
    };
}

function getClassification(percentage) {
    if (percentage >= 70) {
        return { class: 'First Class Honours (1st)', type: 'first-class' };
    } else if (percentage >= 60) {
        return { class: 'Upper Second Class Honours (2:1)', type: 'upper-second' };
    } else if (percentage >= 50) {
        return { class: 'Lower Second Class Honours (2:2)', type: 'lower-second' };
    } else if (percentage >= 40) {
        return { class: 'Third Class Honours (3rd)', type: 'third-class' };
    } else {
        return { class: 'Fail', type: 'fail' };
    }
}

function displayResults(gpaResult) {
    // Display student information
    document.getElementById('resultName').textContent = studentData.name;
    document.getElementById('resultDegree').textContent = studentData.degree;
    document.getElementById('resultBatch').textContent = studentData.batch;
    
    // Display GPA results - only show percentage, not GPA scale
    document.getElementById('finalGPA').style.display = 'none'; // Hide GPA number
    document.getElementById('finalPercentage').textContent = `${gpaResult.finalPercentage.toFixed(1)}%`;
    document.getElementById('finalPercentage').style.fontSize = '3rem';
    document.getElementById('finalPercentage').style.fontWeight = '700';
    document.getElementById('finalPercentage').style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
    document.getElementById('finalPercentage').style.webkitBackgroundClip = 'text';
    document.getElementById('finalPercentage').style.webkitTextFillColor = 'transparent';
    document.getElementById('finalPercentage').style.backgroundClip = 'text';
    
    // Display classification
    const classificationElement = document.getElementById('classification');
    classificationElement.textContent = gpaResult.classification.class;
    classificationElement.className = `classification ${gpaResult.classification.type}`;
    
    // Display modules summary
    displayModulesSummary();
}

function displayModulesSummary() {
    const summaryContainer = document.getElementById('modulesSummary');
    summaryContainer.innerHTML = '<h3><i class="fas fa-list-alt"></i> Modules Summary</h3>';
    
    // Display each year's modules
    Object.keys(studentData.modules).forEach(yearKey => {
        const yearData = studentData.modules[yearKey];
        const yearTitle = getYearTitle(yearKey);
        
        if (hasModules(yearData)) {
            const yearDiv = document.createElement('div');
            yearDiv.className = 'year-modules';
            yearDiv.innerHTML = `
                <h4><i class="fas fa-calendar"></i> ${yearTitle}</h4>
                <div class="module-list">
                    ${generateModulesList(yearData)}
                </div>
            `;
            summaryContainer.appendChild(yearDiv);
        }
    });
}

function getYearTitle(yearKey) {
    switch (yearKey) {
        case 'year1': return 'First Year (Reference Only)';
        case 'year2': return 'Second Year (40% weight)';
        case 'year3': return 'Third Year (60% weight)';
        default: return yearKey;
    }
}

function hasModules(yearData) {
    return yearData.semester1.length > 0 || yearData.semester2.length > 0;
}

function generateModulesList(yearData) {
    let modulesList = '';
    
    [...yearData.semester1, ...yearData.semester2].forEach(module => {
        if (module && module.name) {
            modulesList += `
                <div class="module-item">
                    <span class="module-name">${module.name}</span>
                    <span class="module-mark">${module.mark}%</span>
                </div>
            `;
        }
    });
    
    return modulesList;
}

// Utility functions
function showAlert(message, type = 'info') {
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <i class="fas fa-${type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
        ${message}
    `;
    
    // Style the alert
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#ff6b6b' : '#667eea'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideInAlert 0.3s ease-out;
        max-width: 300px;
    `;
    
    document.body.appendChild(alert);
    
    // Remove alert after 3 seconds
    setTimeout(() => {
        alert.style.animation = 'slideOutAlert 0.3s ease-in forwards';
        setTimeout(() => {
            if (document.body.contains(alert)) {
                document.body.removeChild(alert);
            }
        }, 300);
    }, 3000);
}

function resetCalculator() {
    // Reset all data
    studentData = {
        name: '',
        degree: '',
        batch: '',
        currentYear: '',
        includeFirstYear: false,
        modules: {
            year1: { semester1: [], semester2: [] },
            year2: { semester1: [], semester2: [] },
            year3: { semester1: [], semester2: [] }
        }
    };
    
    // Reset form
    document.querySelectorAll('input').forEach(input => {
        input.value = '';
        input.checked = false;
    });
    
    document.querySelectorAll('select').forEach(select => {
        select.value = '';
    });
    
    document.getElementById('firstYearOption').style.display = 'none';
    document.getElementById('moduleContainer').innerHTML = '';
    
    // Go back to step 1
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('active');
    });
    
    document.getElementById('step1').classList.add('active');
    currentStep = 1;
    updateProgress();
}

function printResults() {
    window.print();
}

// Add CSS for alert animations
const alertStyles = document.createElement('style');
alertStyles.textContent = `
    @keyframes slideInAlert {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutAlert {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(alertStyles);