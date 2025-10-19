import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast, { Toaster } from "react-hot-toast";
import { capNhatNhanVien, dataNhanVien, themNhanVien, xoaNhanVien } from "../../features/nhanvien/nhanVienSlice";
import { dataTramSoTan } from "../../features/tramsotan/tramSoTanSlice";
const defaultNhanVien = {
    id_tram_so_tan: "",
    ho_va_ten: "",
    email: "",
    so_dien_thoai: "",
    mat_khau: "",
    gioi_tinh: "",
    dia_chi: 0,
    ngay_sinh: 0,
    tinh_trang: 1,
};
export default function NhanVien() {
    const [search, setSearch] = useState("");
    const dispatch = useDispatch();
    const data = useSelector((state) => state.nhanvien.nhanvien);
    const dataTram = useSelector((state) => state.tramsotan.tramsotan);
    useEffect(() => {
        dispatch(dataNhanVien());
        dispatch(dataTramSoTan());
    }, []);

    const [nhanVien, setNhanVien] = useState(defaultNhanVien);
    const handleDelNhanVien = async (id) => {
        const result = await dispatch(xoaNhanVien(id));
        if (xoaNhanVien.fulfilled.match(result)) {
            toast.success(result.payload.message || "Xóa thành công");
        } else {
            toast.error(result.payload.message || "Xóa thất bại");
        }
    };

    const handleUpdateNhanVien = async (payload) => {
        try {
            const result = await dispatch(capNhatNhanVien(payload)).unwrap();
            toast.success(result.message || "Cập nhật thành công");
        } catch (error) {
            toast.error(error || "Cập nhật thất bại");
        }
    };

    const handleAddNhanVien = async () => {
        const result = await dispatch(themNhanVien(nhanVien));
        if (themNhanVien.fulfilled.match(result)) {
            toast.success(result.payload.message || "Thêm mới thành công");
        } else {
            toast.error(result.payload || "Thêm mới thất bại");
        }
        setNhanVien({});
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-ocean-900">Nhân viên</h1>
                </div>
                <Dialog>
                    <form>
                        <DialogTrigger asChild>
                            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-ocean-500 text-white cursor-pointer">
                                <Plus className="w-4 h-4" /> Thêm mới
                            </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] h-[500px] overflow-auto">
                            <DialogHeader>
                                <DialogTitle>Thêm nhân viên</DialogTitle>
                                <DialogDescription>Nhấn xác nhận để lưu thay đổi</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4">
                                <div className="grid gap-3">
                                    <Label htmlFor="name-1">Trạm Quản Lý</Label>
                                    <Select
                                        onValueChange={(e) =>
                                            setNhanVien({
                                                ...nhanVien,
                                                id_tram_so_tan: e,
                                            })
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Trạm quản lý" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {dataTram.map((value, index) => (
                                                <SelectItem key={index} value={value.id}>
                                                    {value.ten_khu_vuc}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="name-1">Họ và tên</Label>
                                    <Input
                                        onChange={(e) =>
                                            setNhanVien({
                                                ...nhanVien,
                                                ho_va_ten: e.target.value,
                                            })
                                        }
                                        id="name-1"
                                        name="name"
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="name-1">Email</Label>
                                    <Input
                                        onChange={(e) =>
                                            setNhanVien({
                                                ...nhanVien,
                                                email: e.target.value,
                                            })
                                        }
                                        id="name-1"
                                        name="name"
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="name-1">Số điện thoại</Label>
                                    <Input
                                        onChange={(e) =>
                                            setNhanVien({
                                                ...nhanVien,
                                                so_dien_thoai: e.target.value,
                                            })
                                        }
                                        id="name-1"
                                        name="name"
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="name-1">Mật khẩu</Label>
                                    <Input
                                        onChange={(e) =>
                                            setNhanVien({
                                                ...nhanVien,
                                                mat_khau: e.target.value,
                                            })
                                        }
                                        id="name-1"
                                        name="name"
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="name-1">Giới tính</Label>
                                    <Select
                                        onChange={(e) =>
                                            setNhanVien({
                                                ...nhanVien,
                                                gioi_tinh: e.target.value,
                                            })
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Giới tính" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="true">Nam</SelectItem>
                                            <SelectItem value="false">Nữ</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="name-1">Địa chỉ</Label>
                                    <Input
                                        onChange={(e) =>
                                            setNhanVien({
                                                ...nhanVien,
                                                dia_chi: e.target.value,
                                            })
                                        }
                                        id="name-1"
                                        name="name"
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="name-1">Ngày sinh</Label>
                                    <Input
                                        onChange={(e) =>
                                            setNhanVien({
                                                ...nhanVien,
                                                ngay_sinh: e.target.value,
                                            })
                                        }
                                        id="name-1"
                                        name="name"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <DialogClose asChild>
                                    <Button
                                        onClick={handleAddNhanVien}
                                        className="bg-ocean-500 hover:bg-ocean-900 cursor-pointer"
                                        type="submit"
                                    >
                                        Save changes
                                    </Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </form>
                </Dialog>
            </div>

            <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ocean-300" />
                <input onChange={e => setSearch(e.target.value)}
                    placeholder="Tìm theo họ và tên/số điện thoại ...."
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-ocean-100 bg-white"
                />
            </div>

            <div className="overflow-auto max-h-[430px] rounded-xl border border-ocean-100 bg-white">
                <table className="min-w-[920px] w-full">
                    <thead className="bg-ocean-100/40">
                        <tr className="text-sm">
                            <th className="px-4 py-3">#</th>
                            <th className="px-4 py-3">Trạm quản lý</th>
                            <th className="px-4 py-3">Họ và tên</th>
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Số điện thoại</th>
                            <th className="px-4 py-3">Mật khẩu</th>
                            <th className="px-4 py-3">Giới tính</th>
                            <th className="px-4 py-3">Địa chỉ</th>
                            <th className="px-4 py-3">Ngày sinh</th>
                            <th className="px-4 py-3 text-center">Trạng thái</th>
                            <th className="px-4 py-3 text-right">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-ocean-100 text-center">
                        {data.filter((r) => r.ho_va_ten.toLowerCase().includes(search.toLowerCase())).map((r, i) => (
                            <tr key={r.id} className="text-sm hover:bg-ocean-50/60">
                                <td className="px-4 py-3">{i + 1}</td>
                                <td className="px-4 py-3 font-medium">
                                    {dataTram.find((tram) => tram.id === r.id_tram_so_tan)?.ten_khu_vuc}
                                </td>
                                <td className="px-4 py-3 font-medium">{r.ho_va_ten}</td>
                                <td className="px-4 py-3">{r.email}</td>
                                <td className="px-4 py-3">{r.so_dien_thoai}</td>
                                <td className="px-4 py-3">{r.mat_khau}</td>
                                <td className="px-4 py-3">{r.gioi_tinh ? "Nam" : "Nữ"}</td>
                                <td className="px-4 py-3">{r.dia_chi}</td>
                                <td className="px-4 py-3">{r.ngay_sinh}</td>
                                <td className="px-4 py-3 text-center">
                                    <button
                                        onClick={() =>
                                            handleUpdateNhanVien({
                                                ...r,
                                                tinh_trang: !r.tinh_trang,
                                            })
                                        }
                                        className={`px-4 py-2 rounded-lg text-white text-nowrap font-medium cursor-pointer hover:scale-110 ${
                                            r.tinh_trang ? "bg-green-600" : "bg-red-500"
                                        }`}
                                    >
                                        {r.tinh_trang ? "Hoạt động" : "Dừng"}
                                    </button>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex justify-end gap-2">
                                        <Dialog>
                                            <form>
                                                <DialogTrigger asChild>
                                                    <button
                                                        onClick={() => {
                                                            setNhanVien(r);
                                                        }}
                                                        className="px-3 py-1.5 rounded-lg border border-ocean-100 hover:bg-ocean-100/50"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[425px] h-[500px] overflow-auto">
                                                    <DialogHeader>
                                                        <DialogTitle>Thêm trạm sơ tán</DialogTitle>
                                                        <DialogDescription>
                                                            Nhấn xác nhận để lưu thay đổi
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="grid gap-4">
                                                        <div className="grid gap-3">
                                                            <Label htmlFor="name-1">Trạm Quản Lý</Label>
                                                            <Select
                                                                value={nhanVien.id_tram_so_tan}
                                                                onValueChange={(e) =>
                                                                    setNhanVien({
                                                                        ...nhanVien,
                                                                        id_tram_so_tan: e,
                                                                    })
                                                                }
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Trạm quản lý" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {dataTram.map((value, index) => (
                                                                        <SelectItem key={index} value={value.id}>
                                                                            {value.ten_khu_vuc}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div className="grid gap-3">
                                                            <Label htmlFor="name-1">Họ và tên</Label>
                                                            <Input
                                                                value={nhanVien.ho_va_ten}
                                                                onChange={(e) =>
                                                                    setNhanVien({
                                                                        ...nhanVien,
                                                                        ho_va_ten: e.target.value,
                                                                    })
                                                                }
                                                                id="name-1"
                                                                name="name"
                                                            />
                                                        </div>
                                                        <div className="grid gap-3">
                                                            <Label htmlFor="name-1">Email</Label>
                                                            <Input
                                                                value={nhanVien.email}
                                                                onChange={(e) =>
                                                                    setNhanVien({
                                                                        ...nhanVien,
                                                                        email: e.target.value,
                                                                    })
                                                                }
                                                                id="name-1"
                                                                name="name"
                                                            />
                                                        </div>
                                                        <div className="grid gap-3">
                                                            <Label htmlFor="name-1">Số điện thoại</Label>
                                                            <Input
                                                                value={nhanVien.so_dien_thoai}
                                                                onChange={(e) =>
                                                                    setNhanVien({
                                                                        ...nhanVien,
                                                                        so_dien_thoai: e.target.value,
                                                                    })
                                                                }
                                                                id="name-1"
                                                                name="name"
                                                            />
                                                        </div>
                                                        <div className="grid gap-3">
                                                            <Label htmlFor="name-1">Mật khẩu</Label>
                                                            <Input
                                                                value={nhanVien.mat_khau}
                                                                onChange={(e) =>
                                                                    setNhanVien({
                                                                        ...nhanVien,
                                                                        mat_khau: e.target.value,
                                                                    })
                                                                }
                                                                id="name-1"
                                                                name="name"
                                                            />
                                                        </div>
                                                        <div className="grid gap-3">
                                                            <Label htmlFor="name-1">Giới tính</Label>
                                                            <Select
                                                                value={nhanVien.gioi_tinh}
                                                                onValueChange={(e) =>
                                                                    setNhanVien({
                                                                        ...nhanVien,
                                                                        gioi_tinh: e,
                                                                    })
                                                                }
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Giới tính" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value={true}>Nam</SelectItem>
                                                                    <SelectItem value={false}>Nữ</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div className="grid gap-3">
                                                            <Label htmlFor="name-1">Địa chỉ</Label>
                                                            <Input
                                                                value={nhanVien.dia_chi}
                                                                onChange={(e) =>
                                                                    setNhanVien({
                                                                        ...nhanVien,
                                                                        dia_chi: e.target.value,
                                                                    })
                                                                }
                                                                id="name-1"
                                                                name="name"
                                                            />
                                                        </div>
                                                        <div className="grid gap-3">
                                                            <Label htmlFor="name-1">Ngày sinh</Label>
                                                            <Input
                                                                value={nhanVien.ngay_sinh}
                                                                onChange={(e) =>
                                                                    setNhanVien({
                                                                        ...nhanVien,
                                                                        ngay_sinh: e.target.value,
                                                                    })
                                                                }
                                                                id="name-1"
                                                                name="name"
                                                            />
                                                        </div>
                                                    </div>
                                                    <DialogFooter>
                                                        <DialogClose asChild>
                                                            <Button variant="outline">Cancel</Button>
                                                        </DialogClose>
                                                        <DialogClose asChild>
                                                            <Button
                                                                onClick={() => handleUpdateNhanVien(nhanVien)}
                                                                className="bg-ocean-500 hover:bg-ocean-900 cursor-pointer"
                                                                type="submit"
                                                            >
                                                                Save changes
                                                            </Button>
                                                        </DialogClose>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </form>
                                        </Dialog>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <button className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-md">
                                                <DialogHeader>
                                                    <DialogTitle>Xóa trạm sơ tán</DialogTitle>
                                                    <DialogDescription>
                                                        Nhấn xác nhận để xóa và bạn không thể thu hồi!
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button variant="outline">Cancel</Button>
                                                    </DialogClose>
                                                    <DialogClose asChild>
                                                        <Button
                                                            onClick={() => handleDelNhanVien(r.id)}
                                                            className="bg-ocean-500 hover:bg-ocean-900 cursor-pointer"
                                                            type="submit"
                                                        >
                                                            Save changes
                                                        </Button>
                                                    </DialogClose>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {data?.length === 0 && (
                            <tr>
                                <td colSpan={9} className="px-4 py-8 text-center text-ocean-500">
                                    Không có dữ liệu
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Toaster />
        </div>
    );
}
