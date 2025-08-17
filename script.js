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
let darkModeEnabled = false; // In-memory storage for dark mode preference

// DOM elements
const progressFill = document.getElementById('progressFill');
const steps = document.querySelectorAll('.step');
const formSteps = document.querySelectorAll('.form-step');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeDarkMode();
    updateProgress();
});

// Dark Mode Toggle
function initializeDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    
    if (darkModeToggle) {
        // Set initial state
        if (darkModeEnabled) {
            document.body.classList.add('dark-mode');
            darkModeToggle.checked = true;
        }
        
        // Toggle dark mode
        darkModeToggle.addEventListener('change', function() {
            document.body.classList.toggle('dark-mode');
            darkModeEnabled = this.checked;
        });
    }
}

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
    const moduleInputs = document.querySelectorAll('.module-inputs input[type="text"]');
    const markInputs = document.querySelectorAll('.module-inputs input[type="number"]');
    let isValid = true;
    
    // Check all module names are filled
    moduleInputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = '#ff6b6b';
        } else {
            input.style.borderColor = '';
        }
    });
    
    // Check all marks are valid numbers between 0-100
    markInputs.forEach(input => {
        const value = parseFloat(input.value);
        if (isNaN(value) || value < 0 || value > 100) {
            isValid = false;
            input.style.borderColor = '#ff6b6b';
        } else {
            input.style.borderColor = '';
        }
    });
    
    if (!isValid) {
        showAlert('Please fill in all module names and enter valid marks (0-100)', 'error');
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
    // Reset module data first
    studentData.modules = {
        year1: { semester1: [], semester2: [] },
        year2: { semester1: [], semester2: [] },
        year3: { semester1: [], semester2: [] }
    };

    const moduleInputs = document.querySelectorAll('.module-inputs input');
    
    moduleInputs.forEach(input => {
        const keyParts = input.dataset.key.split('-');
        const year = keyParts[0];
        const semester = keyParts[1];
        const moduleIndex = parseInt(keyParts[2]) - 1;
        const type = keyParts[3]; // 'name' or 'mark'
        
        // Initialize module object if it doesn't exist
        if (!studentData.modules[year][semester][moduleIndex]) {
            studentData.modules[year][semester][moduleIndex] = {};
        }
        
        if (type === 'name') {
            studentData.modules[year][semester][moduleIndex].name = input.value.trim();
        } else if (type === 'mark') {
            const markValue = input.value.trim();
            studentData.modules[year][semester][moduleIndex].mark = markValue ? parseFloat(markValue) : 0;
        }
    });
    
    // Clean up empty modules
    Object.keys(studentData.modules).forEach(year => {
        Object.keys(studentData.modules[year]).forEach(semester => {
            studentData.modules[year][semester] = studentData.modules[year][semester].filter(module => 
                module && (module.name || module.mark !== undefined)
            );
        });
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
    const year2Modules = [
        ...studentData.modules.year2.semester1,
        ...studentData.modules.year2.semester2
    ].filter(module => module && !isNaN(module.mark));
    
    year2ModuleCount = year2Modules.length;
    
    if (year2ModuleCount > 0) {
        const year2Total = year2Modules.reduce((sum, module) => sum + module.mark, 0);
        year2Average = year2Total / year2ModuleCount;
    }
    
    // Calculate Year 3 average
    const year3Modules = [
        ...studentData.modules.year3.semester1,
        ...studentData.modules.year3.semester2
    ].filter(module => module && !isNaN(module.mark));
    
    year3ModuleCount = year3Modules.length;
    
    if (year3ModuleCount > 0) {
        const year3Total = year3Modules.reduce((sum, module) => sum + module.mark, 0);
        year3Average = year3Total / year3ModuleCount;
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
        // Only year 3 data (current 3rd year student)
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
    const finalGPAElement = document.getElementById('finalGPA');
    if (finalGPAElement) {
        finalGPAElement.style.display = 'none'; // Hide GPA number
    }
    
    const finalPercentageElement = document.getElementById('finalPercentage');
    if (finalPercentageElement) {
        finalPercentageElement.textContent = `${gpaResult.finalPercentage.toFixed(1)}%`;
        finalPercentageElement.style.fontSize = '3rem';
        finalPercentageElement.style.fontWeight = '700';
        finalPercentageElement.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
        finalPercentageElement.style.webkitBackgroundClip = 'text';
        finalPercentageElement.style.webkitTextFillColor = 'transparent';
        finalPercentageElement.style.backgroundClip = 'text';
    }
    
    // Display classification
    const classificationElement = document.getElementById('classification');
    if (classificationElement) {
        classificationElement.textContent = gpaResult.classification.class;
        classificationElement.className = `classification ${gpaResult.classification.type}`;
    }
    
    // Create chart if Chart.js is available
    if (typeof Chart !== 'undefined') {
        createResultsChart(gpaResult);
    }
    
    // Display modules summary
    displayModulesSummary();
}

function createResultsChart(gpaResult) {
    const chartCanvas = document.getElementById('resultsChart');
    if (!chartCanvas) return;
    
    const ctx = chartCanvas.getContext('2d');
    
    // Prepare data based on available years
    let labels = [];
    let data = [];
    
    if (studentData.includeFirstYear && (studentData.modules.year1.semester1.length > 0 || studentData.modules.year1.semester2.length > 0)) {
        const year1Avg = calculateYearAverage('year1');
        labels.push('Year 1 (Ref)');
        data.push(year1Avg);
    }
    
    if (studentData.modules.year2.semester1.length > 0 || studentData.modules.year2.semester2.length > 0) {
        labels.push('Year 2 (40%)');
        data.push(gpaResult.year2Average);
    }
    
    if (studentData.modules.year3.semester1.length > 0 || studentData.modules.year3.semester2.length > 0) {
        labels.push('Year 3 (60%)');
        data.push(gpaResult.year3Average);
    }
    
    if (gpaResult.isCompleted) {
        labels.push('Final Weighted');
        data.push(gpaResult.finalPercentage);
    }
    
    // Create gradient for chart
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(102, 126, 234, 0.8)');
    gradient.addColorStop(1, 'rgba(118, 75, 162, 0.8)');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Average Percentage',
                data: data,
                backgroundColor: gradient,
                borderColor: 'rgba(102, 126, 234, 1)',
                borderWidth: 1,
                borderRadius: 6,
                hoverBackgroundColor: 'rgba(102, 126, 234, 0.8)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: document.body.classList.contains('dark-mode') ? 
                              'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        color: document.body.classList.contains('dark-mode') ? 
                              '#f8f9fa' : '#333'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: document.body.classList.contains('dark-mode') ? 
                              '#f8f9fa' : '#333'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.raw.toFixed(1)}%`;
                        }
                    }
                }
            }
        }
    });
}

function displayModulesSummary() {
    const summaryContainer = document.getElementById('modulesSummary');
    if (!summaryContainer) return;
    
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
            let gradeClass = '';
            
            if (module.mark >= 70) {
                gradeClass = 'excellent';
            } else if (module.mark >= 60) {
                gradeClass = 'good';
            } else if (module.mark >= 50) {
                gradeClass = 'average';
            } else {
                gradeClass = 'poor';
            }
            
            modulesList += `
                <div class="module-item ${gradeClass}">
                    <span class="module-name">${module.name}</span>
                    <span class="module-mark">${module.mark}%</span>
                </div>
            `;
        }
    });
    
    return modulesList;
}

// Helper function to calculate year average
function calculateYearAverage(yearKey) {
    const yearData = studentData.modules[yearKey];
    let total = 0;
    let count = 0;
    
    [...yearData.semester1, ...yearData.semester2].forEach(module => {
        if (module && module.mark !== undefined) {
            total += module.mark;
            count++;
        }
    });
    
    return count > 0 ? total / count : 0;
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
    
    const firstYearOption = document.getElementById('firstYearOption');
    if (firstYearOption) {
        firstYearOption.style.display = 'none';
    }
    
    const moduleContainer = document.getElementById('moduleContainer');
    if (moduleContainer) {
        moduleContainer.innerHTML = '';
    }
    
    // Go back to step 1
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('active');
    });
    
    const step1 = document.getElementById('step1');
    if (step1) {
        step1.classList.add('active');
    }
    
    currentStep = 1;
    updateProgress();
}

function printResults() {
    // Add a class for print-specific styling
    document.body.classList.add('printing');
    
    // Print the page
    window.print();
    
    // Remove the print class after a short delay
    setTimeout(() => {
        document.body.classList.remove('printing');
    }, 500);
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
    
    @keyframes fadeInSlide {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .slide-out-left {
        animation: slideOutLeft 0.4s ease-in forwards;
    }
    
    .slide-out-right {
        animation: slideOutRight 0.4s ease-in forwards;
    }
    
    .slide-in-left {
        animation: slideInLeft 0.4s ease-out forwards;
    }
    
    .slide-in-right {
        animation: slideInRight 0.4s ease-out forwards;
    }
    
    @keyframes slideOutLeft {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(-100%);
            opacity: 0;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes slideInLeft {
        from {
            transform: translateX(-100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    /* Color coding for modules */
    .module-item.excellent {
        border-left: 4px solid #28a745;
        background: rgba(40, 167, 69, 0.1);
    }
    
    .module-item.good {
        border-left: 4px solid #17a2b8;
        background: rgba(23, 162, 184, 0.1);
    }
    
    .module-item.average {
        border-left: 4px solid #ffc107;
        background: rgba(255, 193, 7, 0.1);
    }
    
    .module-item.poor {
        border-left: 4px solid #dc3545;
        background: rgba(220, 53, 69, 0.1);
    }
    
    .module-item {
        padding: 10px;
        margin: 5px 0;
        border-radius: 5px;
        transition: all 0.3s ease;
    }
    
    .module-item:hover {
        transform: translateX(5px);
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    /* Dark mode adjustments */
    .dark-mode .module-item.excellent {
        background: rgba(40, 167, 69, 0.2);
    }
    
    .dark-mode .module-item.good {
        background: rgba(23, 162, 184, 0.2);
    }
    
    .dark-mode .module-item.average {
        background: rgba(255, 193, 7, 0.2);
    }
    
    .dark-mode .module-item.poor {
        background: rgba(220, 53, 69, 0.2);
    }
    
    /* Print styles */
    @media print {
        .printing .no-print {
            display: none !important;
        }
        
        .printing .form-step:not(.active) {
            display: none !important;
        }
        
        .printing {
            background: white !important;
            color: black !important;
        }
    }
`;
document.head.appendChild(alertStyles);