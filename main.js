const Main = {
    API_BASE: 'http://localhost:5000/api',
    DEMO_MODE: true,
    
    init() {
        this.setupNavigation();
        this.checkModelStatus();
        this.updateTime();
        setInterval(() => this.updateTime(), 1000);
        Charts.createTrafficChart();
        Charts.createAttackChart();
        Charts.createRiskChart();
        Dashboard.init();
        Detection.init();
        this.setupTraining();
    },
    
    setupNavigation() {
        document.querySelectorAll('[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page;
                document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
                link.parentElement.classList.add('active');
                document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
                document.getElementById(page + '-page').classList.add('active');
                document.getElementById('pageTitle').textContent = link.querySelector('span').textContent;
            });
        });
    },
    
    updateTime() {
        const el = document.getElementById('systemTime');
        if (el) el.textContent = new Date().toLocaleTimeString();
    },
    
    checkModelStatus() {
        document.getElementById('statusDot').className = 'status-dot online';
        document.getElementById('statusText').textContent = 'Demo Mode';
    },
    
    setupTraining() {
        const btn = document.getElementById('startTrainingBtn');
        if (btn) {
            btn.addEventListener('click', () => {
                if (!confirm('Start demo training?')) return;
                btn.disabled = true;
                document.getElementById('trainingProgress').style.display = 'block';
                this.simulateTraining();
            });
        }
    },
    
    simulateTraining() {
        let progress = 0;
        const messages = [
            'Generating training data...',
            'Preprocessing 10000 samples...',
            'Building autoencoder model...',
            'Training epoch 1/50...',
            'Training epoch 10/50...',
            'Training epoch 25/50...',
            'Training epoch 40/50...',
            'Computing anomaly threshold...',
            'Evaluating model...',
            'Training complete!'
        ];
        let msgIdx = 0;
        
        const interval = setInterval(() => {
            progress += 10;
            document.getElementById('trainingProgressBar').style.width = progress + '%';
            document.getElementById('trainingProgressPercent').textContent = progress + '%';
            document.getElementById('trainingMessage').textContent = messages[msgIdx] || 'Processing...';
            msgIdx++;
            
            if (progress >= 100) {
                clearInterval(interval);
                document.getElementById('startTrainingBtn').disabled = false;
                this.showToast('Training complete! Accuracy: 95%', 'success');
            }
        }, 800);
    },
    
    showToast(msg, type = 'info') {
        const c = document.getElementById('toastContainer');
        const t = document.createElement('div');
        t.className = 'toast ' + type;
        t.innerHTML = '<i class="fas fa-info-circle"></i> ' + msg;
        c.appendChild(t);
        setTimeout(() => t.remove(), 4000);
    },
    
    generateFakePacket() {
        const isAttack = Math.random() < 0.3;
        const attackTypes = ['DoS Attack', 'Probe Attack', 'R2L Attack', 'U2R Attack'];
        const protocols = ['tcp', 'udp', 'icmp'];
        const services = ['http', 'ftp', 'smtp', 'ssh', 'dns'];
        
        return {
            is_anomaly: isAttack,
            risk_score: isAttack ? 0.6 + Math.random() * 0.4 : Math.random() * 0.3,
            risk_level: isAttack ? (Math.random() > 0.5 ? 'HIGH' : 'MEDIUM') : (Math.random() > 0.5 ? 'LOW' : 'NORMAL'),
            attack_type: isAttack ? attackTypes[Math.floor(Math.random() * 4)] : 'Normal',
            reconstruction_error: isAttack ? 0.05 + Math.random() * 0.3 : Math.random() * 0.02,
            threshold: 0.022482,
            timestamp: new Date().toISOString(),
            src_ip: `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`,
            dst_ip: `192.168.1.${Math.floor(Math.random()*254)+1}`,
            protocol: protocols[Math.floor(Math.random() * 3)],
            service: services[Math.floor(Math.random() * 5)]
        };
    }
};

document.addEventListener('DOMContentLoaded', () => Main.init());