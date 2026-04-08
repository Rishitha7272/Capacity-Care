const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

const departments = ['Emergency', 'ICU', 'Surgery', 'Cardiology', 'Neurology', 'Pediatrics', 'General Ward', 'Maternity', 'Orthopedics'];
const diagnoses = ['Pneumonia', 'Fracture', 'Surgery', 'Chronic Care', 'Influenza', 'Cardiac Arrest', 'Diabetes Complications', 'Respiratory Infection', 'Gastroenteritis'];
const roles = ['Chief Medical Officer', 'Hospital Administrator', 'Data Analytics Lead', 'Senior Surgeon', 'Head Nurse'];

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max, decimals = 1) {
    const val = Math.random() * (max - min) + min;
    return parseFloat(val.toFixed(decimals));
}

function generateMassiveData(count = 10000) {
    console.log(`🚀 Generating ${count} patient records...`);
    const patients = [];
    const now = new Date();
    
    for (let i = 0; i < count; i++) {
        const admissionDate = new Date(now.getTime() - randomInt(0, 90) * 24 * 60 * 60 * 1000);
        const stayDuration = randomInt(1, 20);
        const dischargeDate = new Date(admissionDate.getTime() + stayDuration * 24 * 60 * 60 * 1000);
        const isDischarged = dischargeDate < now;

        patients.push({
            id: `P-${100000 + i}`,
            age: randomInt(1, 95),
            gender: Math.random() > 0.5 ? 'Male' : 'Female',
            department: departments[randomInt(0, departments.length - 1)],
            admissionDate: admissionDate.toISOString(),
            dischargeDate: isDischarged ? dischargeDate.toISOString() : null,
            diagnosis: diagnoses[randomInt(0, diagnoses.length - 1)],
            cost: randomInt(500, 15000),
            status: isDischarged ? 'Discharged' : 'Admitted',
            satisfactionScore: randomInt(3, 5)
        });
    }

    fs.writeFileSync(path.join(DATA_DIR, 'patient_records.json'), JSON.stringify(patients, null, 2));
    
    // Generate Department Summary
    const deptStats = departments.map(name => {
        const total = randomInt(50, 200);
        const occupied = randomInt(10, total);
        return {
            name,
            totalBeds: total,
            occupiedBeds: occupied,
            availableBeds: total - occupied,
            staffOnDuty: randomInt(20, 80),
            avgLOS: randomFloat(2, 12),
            waitTime: randomInt(10, 120), // minutes
            efficiency: randomInt(75, 98), // percentage
            satisfaction: randomFloat(3.5, 4.9, 1), // out of 5
            readmissionRate: randomFloat(1, 15, 1), // percentage
            complications: randomFloat(0.1, 5, 1), // percentage
            patientVolumeToday: randomInt(50, 300)
        };
    });
    fs.writeFileSync(path.join(DATA_DIR, 'department_stats.json'), JSON.stringify(deptStats, null, 2));

    // Generate Global Analytics
    const kpis = {
        totalPatients: count,
        icuOccupancy: 84.5,
        avgWaitTime: 12.4,
        satisfactionScore: 92.8,
        bedsAvailable: deptStats.reduce((acc, d) => acc + d.availableBeds, 0),
        staffOnDuty: deptStats.reduce((acc, d) => acc + d.staffOnDuty, 0),
        lastUpdated: now.toISOString()
    };
    fs.writeFileSync(path.join(DATA_DIR, 'analytics_summary.json'), JSON.stringify(kpis, null, 2));

    // Testimonials (Keep current ones but locally)
    const testimonials = [
        { name: 'Dr. Sarah Mitchell', role: 'Chief Medical Officer', hospital: 'Metro General Hospital', text: 'CapacityCare transformed our ICU management. We reduced wait times by 40% and improved patient outcomes significantly within just 3 months.', avatar: 'SM', rating: 5 },
        { name: 'James Thornton', role: 'Hospital Administrator', hospital: 'St. Lukes Healthcare Network', text: 'The advanced descriptive data caught a staffing shortage before it happened. This platform pays for itself every single week.', avatar: 'JT', rating: 5 },
        { name: 'Dr. Priya Sharma', role: 'Data Analytics Lead', hospital: 'Sunrise Medical Center', text: 'The visualizations are stunning and the insights are actionable. Our clinical board now makes data-driven decisions with confidence.', avatar: 'PS', rating: 5 },
    ];
    fs.writeFileSync(path.join(DATA_DIR, 'testimonials.json'), JSON.stringify(testimonials, null, 2));

    console.log('✅ Local datasets created successfully in /backend/data');
}

generateMassiveData(10000);
