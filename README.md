# RepairShop Pro 🔧

ระบบจัดการร้านซ่อมคอมพิวเตอร์และสมาร์ทโฟน (Computer & Smartphone Repair Management System) พัฒนาขึ้นเพื่อเป็นส่วนหนึ่งของวิชาการเขียนโปรแกรมเชิงวัตถุ (Object-Oriented Programming)

## 📌 ภาพรวมของระบบ (Project Overview)
RepairShop Pro เป็นเว็บแอปพลิเคชัน (Single Page Application) สำหรับใช้ภายในร้านซ่อมอุปกรณ์ไอที เพื่อให้พนักงานหรือเจ้าของร้านสามารถ:
- บันทึกและจัดการข้อมูลการซ่อม (Repairs) ของลูกค้า
- ติดตามสถานะงานซ่อม (Pending, In Progress, Completed ฯลฯ)
- จัดการฐานข้อมูลลูกค้า (Customers) และช่างซ่อม (Technicians)
- คำนวณค่าใช้จ่ายและจัดการระบบใบแจ้งหนี้ (Billing) อัตโนมัติ
- ดูสถิติและภาพรวมการทำงานผ่านหน้า Dashboard

## 🚀 ฟีเจอร์หลัก (Key Features)
- **Dashboard:** แสดงสถิติจำนวนงานซ่อม, รายได้รวม, แผนภูมิแยกตามประเภทและสถานะ และประวัติกิจกรรมล่าสุด
- **Repairs Management:** ระบบบันทึกงานซ่อมใหม่ รองรับทั้งคอมพิวเตอร์และสมาร์ทโฟน สามารถระบุอาการ, ค่าอะไหล่, ค่าแรง และเลือกช่างซ่อมได้
- **Customer Database:** ระบบจัดการข้อมูลลูกค้าพร้อมดูประวัติการซ่อมและยอดใช้จ่ายรวม
- **Technician Management:** จัดการข้อมูลช่างซ่อม, ความเชี่ยวชาญ, เรทค่าแรง และติดตามจำนวนงานที่รับผิดชอบ
- **Automated Billing:** สร้างใบแจ้งหนี้อัตโนมัติเมื่องานซ่อมเสร็จสิ้น พร้อมสรุปค่าอะไหล่, ค่าแรง, ภาษี และยอดรวม
- **Real-time Filtering:** ค้นหาและกรองข้อมูลงานซ่อมตามสถานะ ประเภท และข้อความค้นหาได้อย่างรวดเร็ว

## 🛠️ โครงสร้างไฟล์ (File Structure)
โปรเจกต์นี้ถูกแบ่งแยกไฟล์ตามหลักการพัฒนาเว็บเพื่อให้ง่ายต่อการจัดการ:
- `index.html` - โครงสร้างของหน้าเว็บ (HTML/DOM) และ UI components (Modals, Tables)
- `style.css` - ไฟล์จัดการความสวยงาม การจัดวาง (Flexbox/Grid) สีสัน และ Responsive Design
- `app.js` - ไฟล์หลักที่ควบคุมการทำงานของแอปพลิเคชัน จัดการข้อมูล (CRUD) และประยุกต์ใช้หลักการ OOP

## 🧠 การประยุกต์ใช้ OOP (OOP Principles Applied)
ระบบนี้ประยุกต์ใช้หลักการ Object-Oriented Programming (OOP) ทั้ง 4 ด้านอย่างครบถ้วนในไฟล์ `app.js`

1. **Encapsulation (การห่อหุ้มข้อมูล)**
   - ซ่อนตัวแปรภายในคลาสโดยใช้ Private fields (เช่น `#status`, `#name`) เพื่อไม่ให้ถูกแก้ไขจากภายนอกโดยตรง
   - เข้าถึงและแก้ไขค่าผ่าน `Getter` และ `Setter` พร้อมทั้งมีการ Validate ข้อมูล (เช่น ตรวจสอบว่าสถานะงานซ่อมถูกต้องหรือไม่ในเมธอด `set status()`)

2. **Inheritance (การสืบทอดคุณสมบัติ)**
   - สร้างคลาสแม่ (Base Class) เช่น `BaseEntity`, `RepairItem` และ `Person`
   - คลาสลูก (Subclass) สืบทอดคุณสมบัติและพฤติกรรมมาใช้งาน เช่น `ComputerRepair` และ `SmartphoneRepair` สืบทอดจาก `RepairItem` หรือ `Customer` และ `Technician` สืบทอดจาก `Person`

3. **Polymorphism (พหุสัณฐาน)**
   - คลาสลูกอย่าง `ComputerRepair` และ `SmartphoneRepair` มีการเขียนทับ (Override) เมธอดของคลาสแม่ (เช่น `get type()`, `calculateCost()`, `getDeviceSpecs()`)
   - ระบบสามารถคำนวณค่าแรงที่แตกต่างกันตามประเภทอุปกรณ์ (คอมพิวเตอร์ หรือ สมาร์ทโฟน) ผ่านการเรียกใช้ `calculateCost()` โดยไม่ต้องเขียนเงื่อนไข If-Else เช็คประเภททุกครั้ง

4. **Abstraction (นามธรรม)**
   - ใช้หลักการออกแบบให้คลาสแม่ (เช่น `BaseEntity`, `RepairItem`) มีลักษณะเป็น Abstract Class คือไม่สามารถสร้างออบเจกต์จากคลาสนี้ได้โดยตรง (Throw error เมื่อพยายาม Instantiate)
   - บังคับให้คลาสลูกต้องสร้างและอิมพลีเมนต์เมธอดที่จำเป็น (เช่น `calculateCost()`)

## 💻 การติดตั้งและการใช้งาน (How to Run)
เนื่องจากโปรเจกต์นี้ทำงานฝั่ง Client-side (Frontend) โดยใช้ Local Storage ในการจำลองฐานข้อมูล จึงไม่จำเป็นต้องติดตั้ง Server-side แต่อย่างใด
1. โคลน (Clone) Repository นี้ลงเครื่อง
   ```bash
   git clone https://github.com/[YOUR-USERNAME]/Mini_Project.git
   ```
2. เปิดไฟล์ `index.html` ผ่านเว็บบราวเซอร์ (เช่น Chrome, Edge) หรือใช้ Live Server extension ใน VS Code

## 📝 ข้อมูลกลุ่ม (Team Members)
1.68026484 นางสาวปานชนก พรหมศรีสวัสดิ์  
2.68026552 นายอมรทิพย์         เรืองคำ
