import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileText } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";

const Policy = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="link"
          className="p-0 h-auto text-green-600 hover:text-green-700 underline"
        >
          chính sách và điều khoản
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Chính sách và Điều khoản sử dụng
          </DialogTitle>
        </DialogHeader>

        <div className="prose prose-sm max-w-none">
          <h3>1. Điều khoản chung</h3>
          <p>
            Bằng việc đăng ký hợp đồng với Busify, bạn đồng ý tuân thủ tất cả
            các điều khoản và điều kiện được quy định trong tài liệu này.
          </p>

          <h3>2. Quyền và nghĩa vụ của nhà xe</h3>
          <ul>
            <li>Cung cấp dịch vụ vận chuyển chất lượng và an toàn</li>
            <li>Tuân thủ lịch trình đã cam kết</li>
            <li>Duy trì tiêu chuẩn xe và đội ngũ lái xe</li>
            <li>Báo cáo định kỳ về hoạt động kinh doanh</li>
          </ul>

          <h3>3. Chính sách hoa hồng</h3>
          <p>
            Busify sẽ thu phí hoa hồng 5-10% trên mỗi vé bán được thông qua nền
            tảng. Việc thanh toán sẽ được thực hiện hàng tháng.
          </p>

          <h3>4. Chính sách hủy hợp đồng</h3>
          <p>
            Cả hai bên có quyền chấm dứt hợp đồng với thông báo trước 30 ngày.
            Trong trường hợp vi phạm nghiêm trọng, hợp đồng có thể bị chấm dứt
            ngay lập tức.
          </p>

          <h3>5. Bảo mật thông tin</h3>
          <p>
            Busify cam kết bảo mật thông tin khách hàng và không chia sẻ với bên
            thứ ba mà không có sự đồng ý.
          </p>

          <h3>6. Giải quyết tranh chấp</h3>
          <p>
            Mọi tranh chấp phát sinh sẽ được giải quyết thông qua thương lượng.
            Nếu không đạt được thỏa thuận, sẽ đưa ra tòa án có thẩm quyền.
          </p>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Đã hiểu</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Policy;
