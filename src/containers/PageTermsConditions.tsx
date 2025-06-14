import React from "react";

const TermsConditions: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-6 text-center">ข้อกำหนดและเงื่อนไขในการใช้งาน</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. ข้อกำหนดทั่วไป</h2>
        <p className="text-base text-gray-700">
          การใช้งานเว็บไซต์นี้หมายความว่าคุณยอมรับข้อกำหนดและเงื่อนไขเหล่านี้ หากคุณไม่เห็นด้วยกับข้อกำหนดใดๆ
          กรุณาหยุดใช้งานเว็บไซต์นี้ทันที
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. การลงทะเบียนและบัญชีผู้ใช้</h2>
        <p className="text-base text-gray-700">
          เพื่อให้สามารถทำการสั่งซื้อสินค้าและบริการต่างๆ ได้ ผู้ใช้จะต้องลงทะเบียนและสร้างบัญชีผู้ใช้
          โดยข้อมูลที่ใช้ในการลงทะเบียนต้องเป็นข้อมูลที่ถูกต้องและครบถ้วน หากข้อมูลที่ให้มาไม่ถูกต้อง
          ทางเราขอสงวนสิทธิ์ในการยกเลิกบัญชีผู้ใช้
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">3. การสั่งซื้อสินค้า</h2>
        <p className="text-base text-gray-700">
          เมื่อทำการสั่งซื้อสินค้าแล้ว ผู้ใช้จะได้รับอีเมลยืนยันการสั่งซื้อ สินค้าจะถูกจัดส่งตามที่อยู่ที่ได้ลงทะเบียนไว้
          ทางเราขอสงวนสิทธิ์ในการยกเลิกคำสั่งซื้อหากพบข้อผิดพลาดในระบบการสั่งซื้อ
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. การชำระเงิน</h2>
        <p className="text-base text-gray-700">
          เรามีวิธีการชำระเงินหลากหลาย เช่น การโอนเงินผ่านธนาคาร การชำระเงินออนไลน์
          และการชำระเงินปลายทาง การชำระเงินจะต้องเสร็จสมบูรณ์ก่อนที่สินค้าจะถูกจัดส่ง
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">5. การจัดส่งสินค้า</h2>
        <p className="text-base text-gray-700">
          การจัดส่งสินค้าจะดำเนินการตามที่อยู่ที่ลงทะเบียนไว้และตามบริการขนส่งที่เลือก โดยระยะเวลาในการจัดส่งจะขึ้นอยู่กับพื้นที่และวิธีการจัดส่งที่เลือก
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">6. การคืนสินค้าและการรับประกัน</h2>
        <p className="text-base text-gray-700">
          ลูกค้าสามารถขอคืนสินค้าภายใน 7 วันหลังจากได้รับสินค้า หากสินค้ามีความผิดปกติหรือไม่ตรงกับคำสั่งซื้อ
          โปรดติดต่อทีมงานของเราภายในระยะเวลาที่กำหนด
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">7. ข้อจำกัดความรับผิดชอบ</h2>
        <p className="text-base text-gray-700">
          ทางเราจะไม่รับผิดชอบต่อความเสียหายใดๆ ที่เกิดจากการใช้งานเว็บไซต์หรือบริการของเรา
          รวมถึงการสูญหายของข้อมูลหรือความเสียหายจากการชำระเงินที่ไม่สมบูรณ์
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">8. การเปลี่ยนแปลงข้อกำหนดและเงื่อนไข</h2>
        <p className="text-base text-gray-700">
          ทางเราขอสงวนสิทธิ์ในการเปลี่ยนแปลงข้อกำหนดและเงื่อนไขได้ตามที่เห็นสมควร โดยจะมีการประกาศการเปลี่ยนแปลงในหน้าเว็บไซต์นี้
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">9. การติดต่อเรา</h2>
        <p className="text-base text-gray-700">
          หากท่านมีคำถามหรือข้อสงสัยเกี่ยวกับข้อกำหนดและเงื่อนไขการใช้งานนี้
          ท่านสามารถติดต่อเราผ่านทางอีเมล support@example.com หรือโทรศัพท์ 123-456-7890
        </p>
      </section>
    </div>
  );
};

export default TermsConditions;
