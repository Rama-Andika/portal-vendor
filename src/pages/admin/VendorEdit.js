import { useStateContext } from "../../contexts/ContextProvider";
import vendorImg from "../../assets/images/company_landscape.jpg";
import { useEffect, useRef, useState } from "react";
import Select from "react-select";
//import { MdKeyboardArrowDown } from "react-icons/md";
import ApiDataWilayahIndonesia from "../../api/ApiDataWilayahIndonesia";
import { PiFileZipDuotone, PiWarningCircleLight } from "react-icons/pi";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { Backdrop, CircularProgress, Fade, Modal } from "@mui/material";
import { FaCloudUploadAlt } from "react-icons/fa";
import titleCase from "../../components/functions/TitleCase";
import GetBase64 from "../../components/functions/GetBase64";
import { useLocation, useNavigate } from "react-router-dom";
import isEmpty from "../../components/functions/CheckEmptyObject";
import { Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

const options = [
  { value: "cv", label: "CV", key: 1 },
  { value: "pt", label: "PT", key: 2 },
  { value: "ud", label: "UD", key: 3 },
  { value: "perseorangan", label: "Perseorangan", key: 4 },
  { value: "lainnya", label: "Lainnya", key: 5 },
];

const optionTipePembelian = [
  { value: "konsinyasi", label: "Konsinyasi", key: 1 },
  { value: "beli putus", label: "Beli Putus", key: 2 },
];

const optionStatusPajak = [
  { value: "PKP", label: "Perusahaan Kena Pajak (PKP)", key: 1 },
  { value: "NPKP", label: "Non Perusahaan Kena Pajak (NPKP)", key: 2 },
];

const optionMetodePengiriman = [
  { value: "darat", label: "Darat", key: 1 },
  { value: "laut", label: "Laut", key: 2 },
  { value: "udara", label: "Udara", key: 3 },
];
const api = process.env.REACT_APP_BASEURL;
const apiExport = process.env.REACT_APP_EXPORT_URL;
const VendorEdit = () => {
  const { screenSize } = useStateContext();
  const [optionProvinsi, setOptionProvinsi] = useState([]);

  //user
  const [username, setUsername] = useState("")

  const [tipePerusahaan, setTipePerusahaan] = useState({});
  const [tipePerusahaanText, setTipePerusahaanText] = useState("");
  const [namaPerusahaan, setNamaPerusahaan] = useState("");
  const [kode, setKode] = useState("");
  const [alamat, setAlamat] = useState("");
  const [provinsi, setProvinsi] = useState({});
  const [kota, setKota] = useState("");
  const [kodePos, setKodePos] = useState("");
  const [tipePembelian, setTipePembelian] = useState({});
  const [npwp, setNpwp] = useState("");
  const [statusPajak, setStatusPajak] = useState({});
  const [status, setStatus] = useState("");
  const [reason, setReason] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [website, setWebsite] = useState("");
  const [namaPemilikPerusahaan, setNamaPemilikPerusahaan] = useState("");
  const [namaPenanggungJawab, setNamaPenanggungJawab] = useState("");
  const [jabatanPenanggungJawab, setJabatanPenanggungJawab] = useState("");
  const [noTelpKantor, setNoTelpKantor] = useState("");
  const [whatsappKeuangan, setWhatsappKeuangan] = useState("");
  const [whatsappPO, setWhatsappPO] = useState("");
  const [emailKorespondensiPo, setEmailKorespondensiPo] = useState("");
  const [namaKontak, setNamaKontak] = useState("");
  const [namaKontakKeuangan, setNamaKontakKeuangan] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [jabatanKeuangan, setJabatanKeuangan] = useState("");
  const [emailKorespondensiKeuangan, setEmailKorespondensiKeuangan] =
    useState("");
  const [termPembayaran, setTermPembayaran] = useState("");
  const [pengembalianBarang, setPengembalianBarang] = useState("");
  const [bank, setBank] = useState("");
  const [nomorRekening, setRekening] = useState("");
  const [namaRekening, setNamaRekening] = useState("");
  const [kantorCabangBank, setKantorCabangBank] = useState("");
  const [metodePengiriman, setMetodePengiriman] = useState({});
  const [rebate, setRebate] = useState("");
  const [marketingFee, setMarketingFee] = useState("");
  const [listingFee, setListingFee] = useState("");
  const [promotionFund, setPromotionFund] = useState("");
  const [npwpFileUpload, setNpwpFileUpload] = useState("");
  const [ktpPemilikFileUpload, setKtpPemilikFileUpload] = useState("");
  const [ktpPenanggungJawabFileUpload, setKtpPenanggungJawabFileUpload] =
    useState("");
  const [spkpFileUpload, setSpkpFileUpload] = useState("");
  const [nibFileUpload, setNibFileUpload] = useState("");
  const [ssPerusahaanFileUpload, setSsPerusahaanFileUpload] = useState("");
  const [sertifBpomFileUpload, setSertifBpomFileUpload] = useState("");

  const [npwpFile, setNpwpFile] = useState(null);
  const [npwpFilePreview, setNpwpFilePreview] = useState(null);

  const [ktpPemilikFile, setKtpPemilikFIle] = useState(null);
  const [ktpPemilikFilePreview, setKtpPemilikFilePreview] = useState(null);

  const [ktpPenanggungJawabFile, setKtpPenanggungJawabFile] = useState(null);
  const [ktpPenanggungJawabFilePreview, setKtpPenanggungJawabFilePreview] =
    useState(null);

  const [spkpFile, setSpkpFile] = useState(null);
  const [spkpFilePreview, setSpkpFilePreview] = useState(null);

  const [nibFile, setNibFile] = useState(null);
  const [nibFilePreview, setNibFilePreview] = useState(null);

  const [ssPerusahaanFile, setSsPerusahaanFile] = useState(null);
  const [ssPerusahaanFilePreview, setSsPerusahaanFilePreview] = useState(null);

  const [sertifBpomFile, setSertifBpomFile] = useState(null);
  const [sertifBpomFilePreview, setSertifBpomFilePreview] = useState(null);

  const { state } = useLocation();

  const navigate = useNavigate();
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const company_section = useRef();
  const [openBackdrop, setOpenBackdrop] = useState(false);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const customeStyles = {
    control: (baseStyles, state) => ({
      ...baseStyles,
    }),
    menu: (baseStyles, state) => ({
      ...baseStyles,
    }),
    option: (baseStyles, state) => ({
      ...baseStyles,
      backgroundColor: state.isSelected
        ? "#569cb8"
        : state.isFocused && "#caf0f8",
    }),
  };

  const fetchProvince = async () => {
    await ApiDataWilayahIndonesia.get("provinces.json").then((response) => {
      const provinsiValue = response.data.map((item, i) => {
        const provinsiCopy = [...optionProvinsi];
        return (provinsiCopy[i] = {
          value: item.name,
          label: item.name,
          key: item.id,
        });
      });

      setOptionProvinsi(provinsiValue);
    });
  };

  const fetchVendor = async () => {
    setOpenBackdrop(true);

    await fetch(`${api}api/portal-vendor/list/vendors`, {
      method: "POST",
      body: JSON.stringify({
        id: state.vendor_id,
      }),
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.data.length > 0) {
          setOpenBackdrop(false);
          const data = res.data[0];
          setNamaPerusahaan(data.nama);
          setKode(data.kode);
          setTipePerusahaan({
            value: data.tipe_perusahaan,
            label: titleCase(data.tipe_perusahaan),
          });
          setTipePerusahaanText(data.tipe_perusahaan_lainnya);
          setProvinsi({
            value: data.provinsi,
            label: data.provinsi.toUpperCase(),
          });
          setAlamat(data.alamat);
          setKota(data.kota);
          setKodePos(data.kode_pos);
          setTipePembelian({
            value: data.tipe_pembelian,
            label: titleCase(data.tipe_pembelian),
          });
          if (data.status_pajak === "PKP") {
            setStatusPajak({
              value: data.status_pajak,
              label: "Perusahaan Kena Pajak (PKP)",
            });
          } else {
            setStatusPajak({
              value: data.status_pajak,
              label: "Non Perusahaan Kena Pajak (NPKP)",
            });
          }
          setNpwp(data.npwp);
          setWebsite(data.website);
          setNamaPemilikPerusahaan(data.nama_pemilik);
          setNamaPenanggungJawab(data.nama_penanggung_jawab);
          setJabatanPenanggungJawab(data.jabatan_penanggung_jawab);
          setNoTelpKantor(data.no_telp_kantor);
          setWhatsappPO(data.no_wa_purchase_order);
          setEmailKorespondensiPo(data.email_korespondensi);
          setNamaKontak(data.nama_kontak);
          setJabatan(data.jabatan_kontak);
          setWhatsappKeuangan(data.no_wa_keuangan);
          setEmailKorespondensiKeuangan(data.email_korespondensi_keuangan);
          setNamaKontakKeuangan(data.nama_kontak_keuangan);
          setJabatanKeuangan(data.jabatan_keuangan);
          setTermPembayaran(data.term_pembayaran);
          setPengembalianBarang(data.pengembalian_barang);
          setBank(data.bank);
          setRekening(data.no_rekening_bank);
          setNamaRekening(data.nama_rekening_bank);
          setKantorCabangBank(data.kantor_cabang_bank);
          setMetodePengiriman({
            value: data.metode_pengiriman,
            label: titleCase(data.metode_pengiriman),
          });
          setRebate(data.rebate === 0 ? "" : data.rebate);
          setMarketingFee(data.marketing_fee === 0 ? "" : data.marketing_fee);
          setListingFee(data.listing_fee === 0 ? "" : data.listing_fee);
          setPromotionFund(
            data.promotion_found === 0 ? "" : data.promotion_found
          );
          setStatus(data.status);
          setReason(data.reason);

          setVendorId(data.vendor_id);
          if (data.VENDOR_NPWP !== undefined) {
            setNpwpFileUpload(data.VENDOR_NPWP);
          }
          if (data.VENDOR_PJ !== undefined) {
            setKtpPenanggungJawabFileUpload(data.VENDOR_PJ);
          }
          if (data.VENDOR_NIB !== undefined) {
            setNibFileUpload(data.VENDOR_NIB);
          }
          if (data.VENDOR_BPOM !== undefined) {
            setSertifBpomFileUpload(data.VENDOR_BPOM);
          }
          if (data.VENDOR_REKENING !== undefined) {
            setSsPerusahaanFileUpload(data.VENDOR_REKENING);
          }
          if (data.VENDOR_SPKP !== undefined) {
            setSpkpFileUpload(data.VENDOR_SPKP);
          }
          if (data.VENDOR_KTP !== undefined) {
            setKtpPemilikFileUpload(data.VENDOR_KTP);
          }
        } else {
          setOpenBackdrop(false);
        }
      })
      .catch((err) => {
        setOpenBackdrop(false);
      });
  };

  const fetchUser = async () => {
    const arr = [state.vendor_id]
    fetch(`${api}api/portal-vendor/list/users`, {
      method: "POST",
      body: JSON.stringify({
        vendor_id: arr,
      }),
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.data.length > 0) {
          const data = res.data[0];
          setUsername(data.username);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateVendor = async () => {
    setOpenBackdrop(true);
    let isSave = false;
    setLoading(true);
    if (
      namaPerusahaan.trim().length > 0 &&
      alamat.trim().length > 0 &&
      !isEmpty(provinsi) &&
      kota.trim().length > 0 &&
      kodePos.trim().length > 0 &&
      !isEmpty(tipePembelian) &&
      !isEmpty(statusPajak) &&
      namaPemilikPerusahaan.trim().length > 0 &&
      namaPenanggungJawab.trim().length > 0 &&
      jabatanPenanggungJawab.trim().length > 0 &&
      noTelpKantor.trim().length > 0 &&
      whatsappPO.trim().length > 0 &&
      namaKontak.trim().length > 0 &&
      whatsappKeuangan.trim().length > 0 &&
      namaKontakKeuangan.trim().length > 0 &&
      jabatanKeuangan.trim().length > 0 &&
      termPembayaran.toString().length > 0 &&
      bank.trim().length > 0 &&
      nomorRekening.trim().length > 0 &&
      namaRekening.trim().length > 0 &&
      kantorCabangBank.trim().length > 0 &&
      !isEmpty(metodePengiriman) &&
      pengembalianBarang.toString().length > 0
    ) {
      fetch(`${api}api/portal-vendor/vendor/validation`, {
        method: "POST",
        body: JSON.stringify({
          id: state.vendor_id,
          name: namaPerusahaan.trim(),
        }),
      })
        .then((response) => response.json())
        .then(async (res) => {
          setOpenBackdrop(false);
          if (!res.data) {
            setLoading(false);
            setOpenBackdrop(false);
            isSave = false;
            setIsError(true);
            setMessage("Nama Perusahaan Sudah ada!");
          } else {
            if (statusPajak.value === "PKP") {
              if (npwp.trim().length === 20) {
                isSave = true;
                setIsError(false);
              } else {
                isSave = false;
                setMessage("Data Belum Lengkap!");
                setIsError(true);
              }
            }

            if (!isEmpty(tipePerusahaan)) {
              if (tipePerusahaan.value === "lainnya") {
                if (tipePerusahaanText.trim().length > 0) {
                  isSave = true;
                  setIsError(false);
                } else {
                  isSave = false;
                  setMessage("Data Belum Lengkap!");
                  setIsError(true);
                }
              } else {
                isSave = true;
                setIsError(false);
              }
            } else {
              isSave = false;
              setMessage("Data Belum Lengkap!");
              setIsError(true);
            }

            if (isSave) {
              const inititalValue = {
                id: state.vendor_id,
                nama: namaPerusahaan.trim(),
                kode: kode.trim(),
                tipe_perusahaan: tipePerusahaan.value,
                tipe_perusahaan_lainnya: tipePerusahaanText.trim(),
                alamat: alamat.trim(),
                provinsi: provinsi.value,
                kota: kota.trim(),
                kode_pos: kodePos.trim(),
                tipe_pembelian: tipePembelian.value,
                status_pajak: statusPajak.value,
                npwp: npwp.trim(),
                website: website.trim(),
                nama_pemilik: namaPemilikPerusahaan.trim(),
                nama_penanggung_jawab: namaPenanggungJawab.trim(),
                jabatan_penanggung_jawab: jabatanPenanggungJawab.trim(),
                no_telp_kantor: noTelpKantor.trim(),
                no_wa_purchase_order: whatsappPO.trim(),
                email_korespondensi: emailKorespondensiPo.trim(),
                nama_kontak: namaKontak.trim(),
                jabatan_kontak: jabatan.trim(),
                no_wa_keuangan: whatsappKeuangan.trim(),
                email_korespondensi_keuangan: emailKorespondensiKeuangan.trim(),
                nama_kontak_keuangan: namaKontakKeuangan.trim(),
                jabatan_keuangan: jabatanKeuangan.trim(),
                term_pembayaran: termPembayaran,
                pengembalian_barang: pengembalianBarang,
                bank: bank.trim(),
                no_rekening_bank: nomorRekening.trim(),
                nama_rekening_bank: namaRekening.trim(),
                kantor_cabang_bank: kantorCabangBank.trim(),
                metode_pengiriman: metodePengiriman.value,
                rebate: rebate.trim(),
                marketing_fee: marketingFee.trim(),
                listing_fee: listingFee.trim(),
                promotion_found: promotionFund,
                file_npwp: npwpFile !== null ? npwpFile : null,
                file_ktp_pemilik:
                  ktpPemilikFile !== null ? ktpPemilikFile : null,
                file_ktp_penanggung_jawab:
                  ktpPenanggungJawabFile !== null
                    ? ktpPenanggungJawabFile
                    : null,
                file_spkp: spkpFile !== null ? spkpFile : null,
                file_nib: nibFile !== null ? nibFile : null,
                file_screenshot_rekening:
                  ssPerusahaanFile !== null ? ssPerusahaanFile : null,
                file_sertikasi_bpom:
                  sertifBpomFile !== null ? sertifBpomFile : null,
                status: status,
                reason: reason,
                vendor_id: vendorId,
              };
              if (Cookies.get("admin_token") !== undefined) {
                await fetch(`${api}api/portal-vendor/sign-up`, {
                  method: "POST",
                  body: JSON.stringify(inititalValue),
                })
                  .then((response) => response.json())
                  .then((res) => {
                    if (res.data === 0) {
                      fetchVendor();
                      setOpenBackdrop(false);
                      toast.error("Update Failed!", {
                        position: "top-right",
                        style: {
                          borderRadius: "10px",
                          background: "#333",
                          color: "#fff",
                        },
                      });
                    } else {
                      fetchVendor();
                      setOpenBackdrop(false);
                      toast.success("Update Success!", {
                        position: "top-right",
                        style: {
                          borderRadius: "10px",
                          background: "#333",
                          color: "#fff",
                        },
                      });
                    }
                    setLoading(false);
                  })
                  .catch((err) => {
                    setLoading(false);
                    fetchVendor();
                    setOpenBackdrop(false);
                    toast.error("Update Failed!", {
                      position: "top-right",
                      style: {
                        borderRadius: "10px",
                        background: "#333",
                        color: "#fff",
                      },
                    });
                  });
              } else {
                navigate("/");
                toast.error("Silahkan Login Terlebih Dahulu!", {
                  position: "top-right",
                  style: {
                    borderRadius: "10px",
                    background: "#333",
                    color: "#fff",
                  },
                });
              }
            }
          }
        })
        .catch((err) => {
          setLoading(false);
          setOpenBackdrop(false);
          setMessage("Data Belum Lengkap!");
          isSave = false;
          console.log(err);
        });
    } else {
      setLoading(false);
      setOpenBackdrop(false);
      setIsError(true);
      setMessage("Data Belum Lengkap!");
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProvince();
    fetchVendor();
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (Cookies.get("admin_token") === undefined) {
      navigate("/admin");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateVendor]);

  const formatNpwp = (value) => {
    try {
      var cleaned = ("" + value).replace(/\D/g, "");
      var match = cleaned.match(
        /(\d{0,1})?(\d{0,2})?(\d{0,3})?(\d{0,3})?(\d{0,1})?(\d{0,3})?(\d{0,3})$/
      );

      var nilai = [
        match[1] && "0",
        match[2],
        match[3] ? "." : "",
        match[3],
        match[4] ? "." : "",
        match[4],
        match[5] ? "." : "",
        match[5],
        match[6] ? "-" : "",
        match[6],
        match[7] ? "." : "",
        match[7],
      ].join("");
      setNpwp(nilai);
    } catch (err) {
      return "";
    }
  };

  const onChangeNpwpFile = (e) => {
    if (e.target.files[0] !== undefined) {
      if (e.target.files[0].size <= 2000000) {
        setNpwpFilePreview(URL.createObjectURL(e.target.files[0]));
        GetBase64(e.target.files[0])
          .then((result) => {
            setNpwpFile(result);
          })
          .catch((err) => {
            setNpwpFile(null);
          });
      } else {
        setNpwpFile(null);
      }
    }
  };

  const onChangeKtpPemilikFile = (e) => {
    if (e.target.files[0] !== undefined) {
      if (e.target.files[0].size <= 2000000) {
        setKtpPemilikFilePreview(URL.createObjectURL(e.target.files[0]));
        GetBase64(e.target.files[0])
          .then((result) => {
            setKtpPemilikFIle(result);
          })
          .catch((err) => {
            setKtpPemilikFIle(null);
          });
      } else {
        setKtpPemilikFIle(null);
      }
    }
  };

  const onChangeKtpPenanggungJawabFile = (e) => {
    if (e.target.files[0] !== undefined) {
      if (e.target.files[0].size <= 2000000) {
        setKtpPenanggungJawabFilePreview(
          URL.createObjectURL(e.target.files[0])
        );
        GetBase64(e.target.files[0])
          .then((result) => {
            setKtpPenanggungJawabFile(result);
          })
          .catch((err) => {
            setKtpPenanggungJawabFile(null);
          });
      } else {
        setKtpPenanggungJawabFile(null);
      }
    }
  };

  const onChangeSpkpFile = (e) => {
    if (e.target.files[0] !== undefined) {
      if (e.target.files[0].size <= 2000000) {
        setSpkpFilePreview(URL.createObjectURL(e.target.files[0]));
        GetBase64(e.target.files[0])
          .then((result) => {
            setSpkpFile(result);
          })
          .catch((err) => {
            setSpkpFile(null);
          });
      } else {
        setSpkpFile(null);
      }
    }
  };

  const onChangeNibFile = (e) => {
    if (e.target.files[0] !== undefined) {
      if (e.target.files[0].size <= 2000000) {
        setNibFilePreview(URL.createObjectURL(e.target.files[0]));
        GetBase64(e.target.files[0])
          .then((result) => {
            setNibFile(result);
          })
          .catch((err) => {
            setNibFile(null);
          });
      } else {
        setNibFile(null);
      }
    }
  };

  const onChangeSsRekeningFile = (e) => {
    if (e.target.files[0] !== undefined) {
      if (e.target.files[0].size <= 2000000) {
        setSsPerusahaanFilePreview(URL.createObjectURL(e.target.files[0]));
        GetBase64(e.target.files[0])
          .then((result) => {
            setSsPerusahaanFile(result);
          })
          .catch((err) => {
            setSsPerusahaanFile(null);
          });
      } else {
        setSsPerusahaanFile(null);
      }
    }
  };

  const onChangeBpomFile = (e) => {
    if (e.target.files[0] !== undefined) {
      if (e.target.files[0].size <= 2000000) {
        setSertifBpomFilePreview(URL.createObjectURL(e.target.files[0]));
        GetBase64(e.target.files[0])
          .then((result) => {
            setSertifBpomFile(result);
          })
          .catch((err) => {
            setSertifBpomFile(null);
          });
      } else {
        setSertifBpomFile(null);
      }
    }
  };

  const onChangeStatusPajak = (item) => {
    setStatusPajak(item);
  };

  const onChangeWhatsappKeuangan = (e) => {
    if (e.target.validity.valid) {
      setWhatsappKeuangan(e.target.value);
    } else {
      setWhatsappKeuangan("");
    }
  };

  const onChangeWhatsappPO = (e) => {
    if (e.target.validity.valid) {
      setWhatsappPO(e.target.value);
    } else {
      setWhatsappPO("");
    }
  };

  const onChangeTermPembayaran = (e) => {
    if (e.target.validity.valid) {
      setTermPembayaran(e.target.value);
    } else {
      setTermPembayaran("");
    }
  };

  const onChangePengembalianBarang = (e) => {
    if (e.target.validity.valid) {
      setPengembalianBarang(e.target.value);
    } else {
      setPengembalianBarang("");
    }
  };

  const onChangeProvinsi = (item) => {
    if (provinsi.value !== item.value) {
      setProvinsi(item);
    }
  };

  const onChangeMarketingFee = (e) => {
    e.target.validity.valid
      ? setMarketingFee(e.target.value)
      : setMarketingFee("");
  };

  const onChangeRebate = (e) => {
    e.target.validity.valid ? setRebate(e.target.value) : setRebate("");
  };

  const onChangeListingFee = (e) => {
    e.target.validity.valid ? setListingFee(e.target.value) : setListingFee("");
  };

  const onChangePromotionFund = (e) => {
    e.target.validity.valid
      ? setPromotionFund(e.target.value)
      : setPromotionFund("");
  };

  const onClickDownload = () => {
    if (Cookies.get("admin_token") !== undefined) {
      window.location = `${apiExport}fin/transactionact/portalvendorinvoicedownload.jsp?oid=${state.vendor_id}`;
    } else {
      navigate("/admin");
      toast.error("Silahkan Login Terlebih Dahulu!", {
        position: "top-right",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };

  // const onClickCompany = () => {
  //   companySection
  //     ? company_section.current.classList.add("hidden")
  //     : company_section.current.classList.remove("hidden");

  //   setCompanySection((prev) => !prev);
  // };

  return (
    <>
      <div
        className="mt-[62px] max-[497px]:mt-[80px] bg-cover bg-center w-full max-[497px]:h-[200px] h-[400px] 
          font-bold  text-[24px] max-[497px]:text-[12px] tracking-wide relative "
      >
        <img
          className="w-full h-full object-cover absolute top-0 left-0 opacity-75"
          src={vendorImg}
          alt=""
        />
        <div className=" absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] h-[100px] whitespace-pre-wrap overflow-hidden">
          {namaPerusahaan}
        </div>
      </div>
      <div
        className={`${
          screenSize < 768 ? "px-2 pt-5" : "px-10"
        } pt-20 font-roboto `}
      >
        <div className="bg-white px-3">
          <div className="flex flex-col items-center gap-5">
            <div className="w-full">
              <div className="mt-0">
                <div className="bg-white mb-3 text-[24px] font-semibold shadow-md py-2 ps-1">
                  <div>Company</div>
                </div>
                <div
                  ref={company_section}
                  className="py-2 bg-white transition-all duration-200 ease-in  "
                >
                  <form action="">
                    <div className="flex flex-col items-center">
                      {screenSize > 612 ? (
                        <>
                          <div className="flex gap-2 items-center mb-3 w-full">
                            <div className=" flex">
                              <label htmlFor="" className="w-72">
                                Status
                              </label>
                              <div>:</div>
                            </div>
                            {status === "SENT_BACK" ? (
                              <div className="flex items-center gap-1">
                                <div className="w-full relative">
                                  <input
                                    value={titleCase(status, "_")}
                                    disabled
                                    type="text"
                                    name=""
                                    id=""
                                    className="bg-gray-200 w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                  />
                                </div>
                                <div
                                  className="cursor-pointer  underline text-[#0077b6]"
                                  onClick={handleOpen}
                                >
                                  The Reason{" "}
                                </div>
                              </div>
                            ) : (
                              <div className="w-full relative">
                                <input
                                  value={titleCase(status, "_")}
                                  disabled
                                  type="text"
                                  name=""
                                  id=""
                                  className="bg-gray-200 w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                />
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2 items-center mb-3 w-full">
                            <div className=" flex">
                              <label htmlFor="" className="w-72">
                                Username
                              </label>
                              <div>:</div>
                            </div>

                            <div className="w-full relative">
                              <input
                                value={username}
                                disabled
                                type="text"
                                name=""
                                id=""
                                className="bg-gray-200 w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                              />
                            </div>
                          </div>
                          
                          <div className="flex gap-2 items-center mb-3 w-full">
                            <div className=" flex">
                              <label htmlFor="" className="w-72">
                                Tipe Perusahaan
                              </label>
                              <div>:</div>
                            </div>
                            <div className="w-full relative flex flex-col gap-1">
                              <Select
                                value={tipePerusahaan}
                                onChange={(item) => setTipePerusahaan(item)}
                                className=""
                                options={options}
                                noOptionsMessage={() => "Data not found"}
                                styles={customeStyles}
                                placeholder="Pilih Tipe Perusahaan..."
                                required
                              />

                              {tipePerusahaan.value === "lainnya" && (
                                <input
                                  value={tipePerusahaanText}
                                  onChange={(e) =>
                                    setTipePerusahaanText(e.target.value)
                                  }
                                  type="text"
                                  name=""
                                  id=""
                                  placeholder="Tulis tipe perusahaan..."
                                  className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                />
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 items-center mb-3 w-full">
                            <div className=" flex">
                              <label htmlFor="" className="w-72">
                                Nama Perusahaan
                              </label>
                              <div>:</div>
                            </div>
                            <div className="w-full relative">
                              <input
                                value={namaPerusahaan}
                                onChange={(e) =>
                                  setNamaPerusahaan(e.target.value.toUpperCase())
                                }
                                type="text"
                                name=""
                                id=""
                                className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                              />
                            </div>
                          </div>
                          <div className="flex gap-2 items-center mb-3 w-full">
                            <div className=" flex">
                              <label htmlFor="" className="w-72">
                                Kode
                              </label>
                              <div>:</div>
                            </div>
                            <div className="w-full relative">
                              <input
                                value={kode}
                                onChange={(e) => setKode(e.target.value)}
                                type="text"
                                name=""
                                id=""
                                disabled
                                className="bg-gray-200 w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                              />
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex flex-col gap-2 mb-3 w-full">
                            <div className=" flex">
                              <label htmlFor="" className="w-72">
                                Status
                              </label>
                            </div>
                            <div className="w-full relative">
                              <input
                                value={status}
                                disabled
                                type="text"
                                name=""
                                id=""
                                className="bg-gray-200 w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 mb-3 w-full">
                            <div className=" flex">
                              <label htmlFor="" className="w-72">
                                Username
                              </label>
                            </div>
                            
                              <div className="w-full relative">
                                <input
                                  value={username}
                                  disabled
                                  type="text"
                                  name=""
                                  id=""
                                  className="bg-gray-200 w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                />
                              </div>
                            
                          </div>
                          <div className="flex flex-col gap-2 mb-3 w-full">
                            <div className=" flex">
                              <label htmlFor="" className="w-72">
                                Tipe Perusahaan
                              </label>
                            </div>
                            <div className="w-full relative">
                              <Select
                                value={tipePerusahaan}
                                onChange={(item) => setTipePerusahaan(item)}
                                className=""
                                options={options}
                                noOptionsMessage={() => "Data not found"}
                                styles={customeStyles}
                                placeholder="Pilih Tipe Perusahaan..."
                                required
                              />

                              {tipePerusahaan.value === "lainnya" && (
                                <input
                                  value={tipePerusahaanText}
                                  onChange={(e) =>
                                    setTipePerusahaanText(e.target.value)
                                  }
                                  type="text"
                                  name=""
                                  id=""
                                  placeholder="Tulis tipe perusahaan..."
                                  className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                />
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 mb-3 w-full">
                            <div className=" flex">
                              <label htmlFor="" className="w-72">
                                Nama Perusahaan
                              </label>
                            </div>
                            <div className="w-full relative">
                              <input
                                value={namaPerusahaan}
                                onChange={(e) =>
                                  setNamaPerusahaan(e.target.value.toUpperCase())
                                }
                                type="text"
                                name=""
                                id=""
                                className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 mb-3 w-full">
                            <div className=" flex">
                              <label htmlFor="" className="w-72">
                                Kode
                              </label>
                            </div>
                            <div className="w-full relative">
                              <input
                                value={kode}
                                onChange={(e) => setKode(e.target.value)}
                                type="text"
                                name=""
                                id=""
                                className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex flex-col items-center">
                      {screenSize > 612 ? (
                        <>
                          <div className="flex gap-2 items-center mb-3 w-full">
                            <div className=" flex">
                              <label htmlFor="" className="w-72">
                                Provinsi
                              </label>
                              <div>:</div>
                            </div>
                            <div className="w-full relative">
                              <Select
                                value={provinsi}
                                onChange={onChangeProvinsi}
                                options={optionProvinsi}
                                className=""
                                noOptionsMessage={() => "Provinsi not found"}
                                styles={customeStyles}
                                placeholder="Pilih Provinsi..."
                                required
                              />
                            </div>
                          </div>
                          <div className="flex gap-2 items-center mb-3 w-full">
                            <div className=" flex">
                              <label htmlFor="" className="w-72">
                                Kota
                              </label>
                              <div>:</div>
                            </div>
                            <div className="w-full relative">
                              <input
                                value={kota}
                                onChange={(e) => setKota(e.target.value)}
                                type="text"
                                name=""
                                id=""
                                className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                              />
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex gap-2 flex-col mb-3 w-full">
                            <div className=" flex">
                              <label htmlFor="" className="w-72">
                                Provinsi
                              </label>
                            </div>
                            <div className="w-full relative">
                              <Select
                                value={provinsi}
                                onChange={onChangeProvinsi}
                                options={optionProvinsi}
                                className=""
                                noOptionsMessage={() => "Provinsi not found"}
                                styles={customeStyles}
                                placeholder="Pilih Provinsi..."
                                required
                              />
                            </div>
                          </div>
                          <div className="flex gap-2 flex-col mb-3 w-full">
                            <div className=" flex">
                              <label htmlFor="" className="w-72">
                                Kota
                              </label>
                            </div>
                            <div className="w-full relative">
                              <input
                                value={kota}
                                onChange={(e) => setKota(e.target.value)}
                                type="text"
                                name=""
                                id=""
                                className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex flex-col items-center">
                      {screenSize > 612 ? (
                        <>
                          <div className="flex gap-2 items-center mb-3 w-full">
                            <div className=" flex">
                              <label htmlFor="" className="w-72">
                                Kode Pos
                              </label>
                              <div>:</div>
                            </div>
                            <div className="w-full relative">
                              <input
                                value={kodePos}
                                onChange={(e) => setKodePos(e.target.value)}
                                type="text"
                                name=""
                                id=""
                                className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                              />
                            </div>
                          </div>

                          <div className="flex gap-2 items-center mb-3 w-full">
                            <div className=" flex">
                              <label htmlFor="" className="w-72">
                                Tipe Pembelian
                              </label>
                              <div>:</div>
                            </div>
                            <div className="w-full relative">
                              <Select
                                value={tipePembelian}
                                onChange={(item) => setTipePembelian(item)}
                                className=""
                                options={optionTipePembelian}
                                noOptionsMessage={() => "Tipe not found"}
                                styles={customeStyles}
                                placeholder="Pilih tipe Pembelian..."
                                required
                              />
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex gap-2 flex-col mb-3 w-full">
                            <div className=" flex">
                              <label htmlFor="" className="w-72">
                                Kode Pos
                              </label>
                            </div>
                            <div className="w-full relative">
                              <input
                                value={kodePos}
                                onChange={(e) => setKodePos(e.target.value)}
                                type="text"
                                name=""
                                id=""
                                className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                              />
                            </div>
                          </div>

                          <div className="flex gap-2 flex-col mb-3 w-full">
                            <div className=" flex">
                              <label htmlFor="" className="w-72">
                                Tipe Pembelian
                              </label>
                            </div>
                            <div className="w-full relative">
                              <Select
                                value={tipePembelian}
                                onChange={(item) => setTipePembelian(item)}
                                className=""
                                options={optionTipePembelian}
                                noOptionsMessage={() => "Tipe not found"}
                                styles={customeStyles}
                                placeholder="Pilih tipe Pembelian..."
                                required
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex flex-col items-center">
                      {screenSize > 612 ? (
                        <>
                          <div className="flex gap-2 items-center mb-3 w-full">
                            <div className=" flex">
                              <label htmlFor="" className="w-72">
                                Status Pajak
                              </label>
                              <div>:</div>
                            </div>
                            <div className="w-full relative">
                              <Select
                                className=""
                                options={optionStatusPajak}
                                value={statusPajak}
                                onChange={onChangeStatusPajak}
                                noOptionsMessage={() =>
                                  "Status pajak not found"
                                }
                                styles={customeStyles}
                                placeholder="Pilih status pajak..."
                                required
                              />
                            </div>
                          </div>

                          <div className="flex gap-2 items-center mb-3 w-full">
                            <div className=" flex">
                              <label htmlFor="" className="w-72">
                                NPWP
                              </label>
                              <div>:</div>
                            </div>
                            <div className="w-full relative">
                              <input
                                maxLength={21}
                                type="text"
                                name=""
                                id=""
                                className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                value={npwp}
                                onChange={(e) => formatNpwp(e.target.value)}
                              />
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex gap-2 flex-col mb-3 w-full">
                            <div className=" flex">
                              <label htmlFor="" className="w-72">
                                Status Pajak
                              </label>
                            </div>
                            <div className="w-full relative">
                              <Select
                                className=""
                                options={optionStatusPajak}
                                defaultValue={statusPajak}
                                onChange={onChangeStatusPajak}
                                noOptionsMessage={() =>
                                  "Status pajak not found"
                                }
                                styles={customeStyles}
                                placeholder="Pilih status pajak..."
                                required
                              />
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 mb-3 w-full">
                            <div className=" flex">
                              <label htmlFor="" className="w-72">
                                NPWP
                              </label>
                            </div>
                            <div className="w-full relative">
                              <input
                                maxLength={21}
                                type="text"
                                name=""
                                id=""
                                className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                value={npwp}
                                onChange={(e) => formatNpwp(e.target.value)}
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {screenSize > 612 ? (
                      <div className="flex gap-2 items-center mb-3">
                        <div className=" flex">
                          <label htmlFor="" className="w-72">
                            Website
                          </label>
                          <div>:</div>
                        </div>
                        <div className="w-full">
                          <input
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            type="text"
                            name=""
                            id=""
                            className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2 mb-3">
                        <div className=" flex">
                          <label htmlFor="" className="w-72">
                            Website
                          </label>
                        </div>
                        <div className="w-full">
                          <input
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            type="text"
                            name=""
                            id=""
                            className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                          />
                        </div>
                      </div>
                    )}

                    {screenSize > 612 ? (
                      <div className="flex gap-2 mb-3 w-full">
                        <div className=" flex">
                          <label htmlFor="" className="w-72">
                            Alamat
                          </label>
                          <div>:</div>
                        </div>
                        <div className="w-full relative">
                          <textarea
                            rows={5}
                            value={alamat}
                            onChange={(e) => setAlamat(e.target.value)}
                            name=""
                            id=""
                            className="w-full border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2 mb-3 w-full">
                        <div className=" flex">
                          <label htmlFor="" className="w-72">
                            Alamat
                          </label>
                        </div>
                        <div className="w-full relative">
                          <textarea
                            rows={5}
                            value={alamat}
                            onChange={(e) => setAlamat(e.target.value)}
                            name=""
                            id=""
                            className="w-full border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                          />
                        </div>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-2">
            <div className="bg-white mb-3 text-[24px] font-semibold shadow-md py-2 ps-1">
              <div>Contact Person</div>
            </div>
            <div
              id="contact-section"
              className="py-2 bg-white transition-all duration-200 ease-in"
            >
              <form action="">
                <div className="flex flex-col min-[612px]:flex-row gap-5 min-[612px]:gap-2 mb-3 w-full min-[612px]:items-center">
                  <div className=" flex">
                    <label htmlFor="" className="w-72">
                      Nama Pemilik Perusahaan
                    </label>
                    <div className="hidden min-[612px]:block">:</div>
                  </div>
                  <div className="w-full relative">
                    <input
                      value={namaPemilikPerusahaan}
                      onChange={(e) => setNamaPemilikPerusahaan(e.target.value)}
                      type="text"
                      name=""
                      id=""
                      className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                    />
                  </div>
                </div>
                <div className="flex flex-col min-[612px]:flex-row gap-5 min-[612px]:gap-2 mb-3 w-full min-[612px]:items-center">
                  <div className=" flex">
                    <label htmlFor="" className="w-72">
                      Nama Penanggung Jawab
                    </label>
                    <div className="hidden min-[612px]:block">:</div>
                  </div>
                  <div className="w-full relative">
                    <input
                      value={namaPenanggungJawab}
                      onChange={(e) => setNamaPenanggungJawab(e.target.value)}
                      type="text"
                      name=""
                      id=""
                      className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                    />
                  </div>
                </div>
                <div className="flex flex-col min-[612px]:flex-row gap-5 min-[612px]:gap-2 mb-3 w-full min-[612px]:items-center">
                  <div className=" flex">
                    <label htmlFor="" className="w-72">
                      Jabatan Penanggung Jawab
                    </label>
                    <div className="hidden min-[612px]:block">:</div>
                  </div>
                  <div className="w-full relative">
                    <input
                      value={jabatanPenanggungJawab}
                      onChange={(e) =>
                        setJabatanPenanggungJawab(e.target.value)
                      }
                      type="text"
                      name=""
                      id=""
                      className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                    />
                  </div>
                </div>
                <div className="flex flex-col min-[612px]:flex-row gap-5 min-[612px]:gap-2 mb-3 w-full min-[612px]:items-center">
                  <div className=" flex">
                    <label htmlFor="" className="w-72">
                      No. Telp Kantor
                    </label>
                    <div className="hidden min-[612px]:block">:</div>
                  </div>
                  <div className="w-full relative">
                    <input
                      value={noTelpKantor}
                      onChange={(e) => setNoTelpKantor(e.target.value)}
                      type="text"
                      name=""
                      id=""
                      className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                    />
                  </div>
                </div>
                <div className="mt-10 underline">
                  Kontak Korenspondensi Notifikasi
                </div>
                <div className="flex flex-col min-[612px]:flex-row gap-5 min-[612px]:gap-2 mb-3 w-full min-[612px]:items-center mt-2">
                  <div className="flex">
                    <label htmlFor="" className="w-72">
                      No Whatsapp Purchase Order (PO)
                    </label>
                    <div className="hidden min-[612px]:block">:</div>
                  </div>
                  <div className="w-full relative">
                    <input
                      type="text"
                      pattern="[0-9]*"
                      name=""
                      id=""
                      value={whatsappPO}
                      onChange={(e) => onChangeWhatsappPO(e)}
                      className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                    />
                  </div>
                </div>
                <div className="flex flex-col min-[612px]:flex-row gap-5 min-[612px]:gap-2 mb-3 w-full min-[612px]:items-center">
                  <div className=" flex">
                    <label htmlFor="" className="w-72">
                      Email Korespondensi PO
                    </label>
                    <div className="hidden min-[612px]:block">:</div>
                  </div>
                  <div className="w-full relative">
                    <input
                      value={emailKorespondensiPo}
                      onChange={(e) => setEmailKorespondensiPo(e.target.value)}
                      type="email"
                      name=""
                      id=""
                      className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                    />
                  </div>
                </div>
                <div className="flex flex-col min-[612px]:flex-row gap-5 min-[612px]:gap-2 mb-3 w-full min-[612px]:items-center">
                  <div className=" flex">
                    <label htmlFor="" className="w-72">
                      Nama Kontak
                    </label>
                    <div className="hidden min-[612px]:block">:</div>
                  </div>
                  <div className="w-full relative">
                    <input
                      value={namaKontak}
                      onChange={(e) => setNamaKontak(e.target.value)}
                      type="text"
                      name=""
                      id=""
                      className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                    />
                  </div>
                </div>
                <div className="flex flex-col min-[612px]:flex-row gap-5 min-[612px]:gap-2 mb-3 w-full min-[612px]:items-center">
                  <div className=" flex">
                    <label htmlFor="" className="w-72">
                      Jabatan
                    </label>
                    <div className="hidden min-[612px]:block">:</div>
                  </div>
                  <div className="w-full relative">
                    <input
                      value={jabatan}
                      onChange={(e) => setJabatan(e.target.value)}
                      type="text"
                      name=""
                      id=""
                      className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                    />
                  </div>
                </div>
                <div className="flex flex-col min-[612px]:flex-row gap-5 min-[612px]:gap-2 mb-3 w-full min-[612px]:items-center mt-10">
                  <div className=" flex">
                    <label htmlFor="" className="w-72">
                      No. Whatsapp Keuangan
                    </label>
                    <div className="hidden min-[612px]:block">:</div>
                  </div>
                  <div className="w-full relative">
                    <input
                      maxLength={20}
                      pattern="[0-9]*"
                      type="text"
                      name=""
                      id=""
                      value={whatsappKeuangan}
                      onChange={(e) => onChangeWhatsappKeuangan(e)}
                      className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                    />
                  </div>
                </div>
                <div className="flex flex-col min-[612px]:flex-row gap-5 min-[612px]:gap-2 mb-3 w-full min-[612px]:items-center">
                  <div className=" flex">
                    <label htmlFor="" className="w-72">
                      Email Korespondensi Keuangan
                    </label>
                    <div className="hidden min-[612px]:block">:</div>
                  </div>
                  <div className="w-full relative">
                    <input
                      value={emailKorespondensiKeuangan}
                      onChange={(e) =>
                        setEmailKorespondensiKeuangan(e.target.value)
                      }
                      type="email"
                      name=""
                      id=""
                      className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                    />
                  </div>
                </div>
                <div className="flex flex-col min-[612px]:flex-row gap-5 min-[612px]:gap-2 mb-3 w-full min-[612px]:items-center">
                  <div className=" flex">
                    <label htmlFor="" className="w-72">
                      Nama Kontak
                    </label>
                    <div className="hidden min-[612px]:block">:</div>
                  </div>
                  <div className="w-full relative">
                    <input
                      value={namaKontakKeuangan}
                      onChange={(e) => setNamaKontakKeuangan(e.target.value)}
                      type="text"
                      name=""
                      id=""
                      className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                    />
                  </div>
                </div>
                <div className="flex flex-col min-[612px]:flex-row gap-5 min-[612px]:gap-2 mb-3 w-full min-[612px]:items-center">
                  <div className=" flex">
                    <label htmlFor="" className="w-72">
                      Jabatan
                    </label>
                    <div className="hidden min-[612px]:block">:</div>
                  </div>
                  <div className="w-full relative">
                    <input
                      value={jabatanKeuangan}
                      onChange={(e) => setJabatanKeuangan(e.target.value)}
                      type="text"
                      name=""
                      id=""
                      className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="mt-2">
            <div className="bg-white mb-3 text-[24px] font-semibold shadow-md py-2 ps-1">
              <div>Payment</div>
            </div>
            <div
              id="contact-section"
              className="py-2 bg-white transition-all duration-200 ease-in"
            >
              <form action="">
                <div className="underline ">Detail Pembayaran</div>
                <div className="flex flex-col min-[612px]:flex-row gap-5 min-[612px]:gap-2 mb-3 w-full min-[612px]:items-center mt-2">
                  <div className=" flex">
                    <label htmlFor="" className="w-72">
                      Term
                    </label>
                    <div className="hidden min-[612px]:block">:</div>
                  </div>
                  <div className="w-full relative flex items-center gap-1">
                    <input
                      type="text"
                      pattern="[0-9]*"
                      name=""
                      id=""
                      value={termPembayaran}
                      onChange={onChangeTermPembayaran}
                      className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                    />
                    <div>Hari</div>
                  </div>
                </div>
                <div className="flex flex-col min-[612px]:flex-row gap-5 min-[612px]:gap-2 mb-3 w-full min-[612px]:items-center">
                  <div className=" flex">
                    <label htmlFor="" className="w-72">
                      Bank
                    </label>
                    <div className="hidden min-[612px]:block">:</div>
                  </div>
                  <div className="w-full relative">
                    <input
                      value={bank}
                      onChange={(e) => setBank(e.target.value)}
                      type="text"
                      name=""
                      id=""
                      className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                    />
                  </div>
                </div>
                <div className="flex flex-col min-[612px]:flex-row gap-5 min-[612px]:gap-2 mb-3 w-full min-[612px]:items-center">
                  <div className=" flex">
                    <label htmlFor="" className="w-72">
                      No. Rekening Bank
                    </label>
                    <div className="hidden min-[612px]:block">:</div>
                  </div>
                  <div className="w-full relative">
                    <input
                      value={nomorRekening}
                      onChange={(e) => setRekening(e.target.value)}
                      type="text"
                      name=""
                      id=""
                      className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                    />
                  </div>
                </div>
                <div className="flex flex-col min-[612px]:flex-row gap-5 min-[612px]:gap-2 mb-3 w-full min-[612px]:items-center">
                  <div className=" flex">
                    <label htmlFor="" className="w-72">
                      Nama Rekening Bank
                    </label>
                    <div className="hidden min-[612px]:block">:</div>
                  </div>
                  <div className="w-full relative">
                    <input
                      value={namaRekening}
                      onChange={(e) => setNamaRekening(e.target.value)}
                      type="text"
                      name=""
                      id=""
                      className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                    />
                  </div>
                </div>
                <div className="flex flex-col min-[612px]:flex-row gap-5 min-[612px]:gap-2 mb-3 w-full min-[612px]:items-center">
                  <div className=" flex">
                    <label htmlFor="" className="w-72">
                      Kantor Cabang Bank
                    </label>
                    <div className="hidden min-[612px]:block">:</div>
                  </div>
                  <div className="w-full relative flex items-center gap-1">
                    <div>KCP</div>
                    <input
                      value={kantorCabangBank}
                      onChange={(e) => setKantorCabangBank(e.target.value)}
                      type="text"
                      name=""
                      id=""
                      className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                    />
                  </div>
                </div>
                <div className="flex flex-col min-[612px]:flex-row gap-5 min-[612px]:gap-2 mb-3 w-full min-[612px]:items-center">
                  <div className=" flex">
                    <label htmlFor="" className="w-72">
                      Metode Pengiriman
                    </label>
                    <div className="hidden min-[612px]:block">:</div>
                  </div>
                  <div className="w-full relative">
                    <Select
                      value={metodePengiriman}
                      onChange={(item) => setMetodePengiriman(item)}
                      options={optionMetodePengiriman}
                      noOptionsMessage={() => "Metode not found"}
                      styles={customeStyles}
                      placeholder="Pilih metode pengiriman..."
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-col min-[612px]:flex-row gap-5 min-[612px]:gap-2 mb-3 w-full min-[612px]:items-center mt-2">
                  <div className=" flex">
                    <label htmlFor="" className="w-72">
                      Pengembalian Barang
                    </label>
                    <div className="hidden min-[612px]:block">:</div>
                  </div>
                  <div className="w-full relative flex items-center gap-1">
                    <input
                      type="text"
                      pattern="[0-9]*"
                      name=""
                      id=""
                      value={pengembalianBarang}
                      onChange={onChangePengembalianBarang}
                      className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                    />
                    <div>Hari</div>
                  </div>
                </div>

                <div className="flex flex-col min-[612px]:flex-row gap-5 min-[612px]:gap-2 mb-3 w-full min-[612px]:items-center mt-10">
                  <div className=" flex">
                    <label htmlFor="" className="w-72">
                      Rebate
                    </label>
                    <div className="hidden min-[612px]:block">:</div>
                  </div>
                  <div className="w-full relative">
                    <input
                      value={rebate}
                      onChange={onChangeRebate}
                      onKeyDown={(evt) =>
                        (evt.key === "e" || evt.key === "-") &&
                        evt.preventDefault()
                      }
                      min={0}
                      step={0.01}
                      type="number"
                      className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                    />
                  </div>
                </div>
                <div className="flex flex-col min-[612px]:flex-row gap-5 min-[612px]:gap-2 mb-3 w-full min-[612px]:items-center">
                  <div className=" flex">
                    <label htmlFor="" className="w-72">
                      Marketing Fee
                    </label>
                    <div className="hidden min-[612px]:block">:</div>
                  </div>
                  <div className="w-full relative">
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      value={marketingFee}
                      onChange={onChangeMarketingFee}
                      onKeyDown={(evt) =>
                        (evt.key === "e" || evt.key === "-") &&
                        evt.preventDefault()
                      }
                      className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                    />
                  </div>
                </div>
                <div className="flex flex-col min-[612px]:flex-row gap-5 min-[612px]:gap-2 mb-3 w-full min-[612px]:items-center">
                  <div className=" flex">
                    <label htmlFor="" className="w-72">
                      Listing Fee
                    </label>
                    <div className="hidden min-[612px]:block">:</div>
                  </div>
                  <div className="w-full relative">
                    <input
                      min={0}
                      step={0.01}
                      value={listingFee}
                      onChange={onChangeListingFee}
                      onKeyDown={(evt) =>
                        (evt.key === "e" || evt.key === "-") &&
                        evt.preventDefault()
                      }
                      type="number"
                      className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                    />
                  </div>
                </div>
                <div className="flex flex-col min-[612px]:flex-row gap-5 min-[612px]:gap-2 mb-3 w-full min-[612px]:items-center">
                  <div className=" flex">
                    <label htmlFor="" className="w-72">
                      Promotion Fund
                    </label>
                    <div className="hidden min-[612px]:block">:</div>
                  </div>
                  <div className="w-full relative">
                    <input
                      min={0}
                      step={0.01}
                      value={promotionFund}
                      onChange={onChangePromotionFund}
                      onKeyDown={(evt) =>
                        (evt.key === "e" || evt.key === "-") &&
                        evt.preventDefault()
                      }
                      type="number"
                      className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                    />
                  </div>
                </div>
              </form>
              <div className="flex justify-end max-[415px]:w-full py-4">
                <button
                  type="button"
                  onClick={() => onClickDownload()}
                  className="mt-5 max-[415px]:w-full rounded-md py-2 px-5 text-white bg-[#0077b6] w-fit cursor-pointer flex gap-1 items-center"
                >
                  <div className="">
                    <PiFileZipDuotone />
                  </div>
                  <div className="w-full">Download Document</div>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-2">
            <div className="bg-white mb-3 text-[24px] font-semibold shadow-md py-2 ps-1">
              <div>Document</div>
            </div>
            <div
              id="contact-section"
              className="py-2 bg-white transition-all duration-200 ease-in"
            >
              <form action="">
                <div className="flex flex-col min-[612px]:flex-row gap-5 min-[612px]:gap-2 mb-3 w-full min-[612px]:items-center">
                  <div className="flex flex-col gap-1">
                    <div className=" flex">
                      <label htmlFor="" className="w-72">
                        NPWP / Surat Keterangan Bebas Pajak
                      </label>
                      <div className="hidden min-[612px]:block">:</div>
                    </div>
                    <div className="text-[10px] text-gray-500">
                      Max size 2 mb
                    </div>
                  </div>

                  <div className=" relative">
                    <label htmlFor="upload-npwp" className="w-fit">
                      {npwpFile === null ? (
                        <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                          <span>
                            <FaCloudUploadAlt />
                          </span>
                          <div>Upload</div>
                        </div>
                      ) : (
                        <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                          <span>
                            <FaCloudUploadAlt />
                          </span>
                          <div>1 File</div>
                        </div>
                      )}
                    </label>
                    <input
                      type="file"
                      onChange={onChangeNpwpFile}
                      id="upload-npwp"
                      accept=".jpg,.pdf"
                      className="hidden w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                    />
                  </div>
                  {npwpFileUpload.trim().length > 0 && (
                    <a
                      href={`${apiExport}fin/transactionact/view_portal_file.jsp?file=${npwpFileUpload}`}
                      target="_blank"
                      className="underline cursor-pointer text-blue-500"
                      rel="noreferrer"
                    >
                      File terupload
                    </a>
                  )}
                </div>
                {npwpFile !== null &&
                RegExp("\\bpdf\\b").test(npwpFile.split(",")[0]) ? (
                  <div className="h-[500px] w-[500px] max-[612px]:w-full mb-5">
                    <div className="h-full w-full">
                      <Viewer fileUrl={npwpFilePreview} />
                    </div>
                  </div>
                ) : (
                  npwpFile !== null && (
                    <div className="h-[500px] w-[400px] max-[612px]:w-full mb-5">
                      <div className="h-full w-full">
                        <img
                          src={npwpFilePreview}
                          alt="no"
                          className="w-full h-full"
                        />
                      </div>
                    </div>
                  )
                )}
                <div className="flex flex-col min-[612px]:flex-row gap-5 min-[612px]:gap-2 mb-3 w-full min-[612px]:items-center">
                  <div className="flex flex-col gap-1">
                    <div className=" flex">
                      <label htmlFor="" className="w-72">
                        KTP Pemilik
                      </label>
                      <div className="hidden min-[612px]:block">:</div>
                    </div>
                    <div className="text-[10px] text-gray-500">
                      Max size 2 mb
                    </div>
                  </div>
                  <div className=" relative">
                    <label htmlFor="upload-ktppemilik" className="w-fit">
                      {ktpPemilikFile === null ? (
                        <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                          <span>
                            <FaCloudUploadAlt />
                          </span>
                          <div>Upload</div>
                        </div>
                      ) : (
                        <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                          <span>
                            <FaCloudUploadAlt />
                          </span>
                          <div>1 File</div>
                        </div>
                      )}
                    </label>
                    <input
                      onChange={onChangeKtpPemilikFile}
                      type="file"
                      id="upload-ktppemilik"
                      accept=".jpg,.pdf"
                      className="hidden w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                    />
                  </div>
                  {ktpPemilikFileUpload.trim().length > 0 && (
                    <a
                      href={`${apiExport}fin/transactionact/view_portal_file.jsp?file=${ktpPemilikFileUpload}`}
                      target="_blank"
                      className="underline cursor-pointer text-blue-500"
                      rel="noreferrer"
                    >
                      File terupload
                    </a>
                  )}
                </div>
                {ktpPemilikFile !== null &&
                RegExp("\\bpdf\\b").test(ktpPemilikFile.split(",")[0]) ? (
                  <div className="h-[500px] w-[500px] max-[612px]:w-full mb-5">
                    <div className="h-full w-full">
                      <Viewer fileUrl={ktpPemilikFilePreview} />
                    </div>
                  </div>
                ) : (
                  ktpPemilikFile !== null && (
                    <div className="h-[500px] w-[400px] max-[612px]:w-full mb-5">
                      <div className="h-full w-full">
                        <img
                          src={ktpPemilikFilePreview}
                          alt="no"
                          className="w-full h-full"
                        />
                      </div>
                    </div>
                  )
                )}
                <div className="flex flex-col min-[612px]:flex-row gap-5 min-[612px]:gap-2 mb-3 w-full min-[612px]:items-center">
                  <div className="flex flex-col gap-1">
                    <div className=" flex">
                      <label htmlFor="" className="w-72">
                        KTP Penganggung Jawab
                      </label>
                      <div className="hidden min-[612px]:block">:</div>
                    </div>
                    <div className="text-[10px] text-gray-500">
                      Max size 2 mb
                    </div>
                  </div>
                  <div className="relative">
                    <label
                      htmlFor="upload-ktppenanggungjawab"
                      className="w-fit"
                    >
                      {ktpPenanggungJawabFile === null ? (
                        <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                          <span>
                            <FaCloudUploadAlt />
                          </span>
                          <div>Upload</div>
                        </div>
                      ) : (
                        <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                          <span>
                            <FaCloudUploadAlt />
                          </span>
                          <div>1 File</div>
                        </div>
                      )}
                    </label>
                    <input
                      onChange={onChangeKtpPenanggungJawabFile}
                      type="file"
                      id="upload-ktppenanggungjawab"
                      accept=".jpg,.pdf"
                      className="hidden w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                    />
                  </div>
                  {ktpPenanggungJawabFileUpload.trim().length > 0 && (
                    <a
                      href={`${apiExport}fin/transactionact/view_portal_file.jsp?file=${ktpPenanggungJawabFileUpload}`}
                      target="_blank"
                      className="underline cursor-pointer text-blue-500"
                      rel="noreferrer"
                    >
                      File terupload
                    </a>
                  )}
                </div>
                {ktpPenanggungJawabFile !== null &&
                RegExp("\\bpdf\\b").test(
                  ktpPenanggungJawabFile.split(",")[0]
                ) ? (
                  <div className="h-[500px] w-[500px] max-[612px]:w-full mb-5">
                    <div className="h-full w-full">
                      <Viewer fileUrl={ktpPenanggungJawabFilePreview} />
                    </div>
                  </div>
                ) : (
                  ktpPenanggungJawabFile !== null && (
                    <div className="h-[500px] w-[400px] max-[612px]:w-full mb-5">
                      <div className="h-full w-full">
                        <img
                          src={ktpPenanggungJawabFilePreview}
                          alt="no"
                          className="w-full h-full"
                        />
                      </div>
                    </div>
                  )
                )}

                <div className="flex flex-col min-[612px]:flex-row gap-5 min-[612px]:gap-2 mb-3 w-full min-[612px]:items-center">
                  <div className="flex flex-col gap-1">
                    <div className=" flex">
                      <label htmlFor="" className="w-72 whitespace-pre-wrap">
                        Surat Pengukuhan Kena Pajak (SPKP) / Surat Keterangan
                        Non PKP (Bagi Pengusaha Tidak Kena Pajak)
                      </label>
                      <div className="hidden min-[612px]:block">:</div>
                    </div>
                    <div className="text-[10px] text-gray-500">
                      Max size 2 mb
                    </div>
                  </div>
                  <div className=" relative">
                    <label htmlFor="upload-spkp" className="w-fit">
                      {spkpFile === null ? (
                        <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                          <span>
                            <FaCloudUploadAlt />
                          </span>
                          <div>Upload</div>
                        </div>
                      ) : (
                        <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                          <span>
                            <FaCloudUploadAlt />
                          </span>
                          <div>1 File</div>
                        </div>
                      )}
                    </label>
                    <input
                      type="file"
                      onChange={onChangeSpkpFile}
                      id="upload-spkp"
                      accept=".jpg,.pdf"
                      className="hidden w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                    />
                  </div>
                  {spkpFileUpload.trim().length > 0 && (
                    <a
                      href={`${apiExport}fin/transactionact/view_portal_file.jsp?file=${spkpFileUpload}`}
                      target="_blank"
                      className="underline cursor-pointer text-blue-500"
                      rel="noreferrer"
                    >
                      File terupload
                    </a>
                  )}
                </div>
                {spkpFile !== null &&
                RegExp("\\bpdf\\b").test(spkpFile.split(",")[0]) ? (
                  <div className="h-[500px] w-[500px] max-[612px]:w-full mb-5">
                    <div className="h-full w-full">
                      <Viewer fileUrl={spkpFilePreview} />
                    </div>
                  </div>
                ) : (
                  spkpFile !== null && (
                    <div className="h-[500px] w-[400px] max-[612px]:w-full mb-5">
                      <div className="h-full w-full">
                        <img
                          src={spkpFilePreview}
                          alt="no"
                          className="w-full h-full"
                        />
                      </div>
                    </div>
                  )
                )}

                <div className="flex flex-col min-[612px]:flex-row gap-5 min-[612px]:gap-2 mb-3 w-full min-[612px]:items-center">
                  <div className="flex flex-col gap-1">
                    <div className=" flex">
                      <label htmlFor="" className="w-72">
                        Nomer Induk Berusaha (NIB)
                      </label>
                      <div className="hidden min-[612px]:block">:</div>
                    </div>
                    <div className="text-[10px] text-gray-500">
                      Max size 2 mb
                    </div>
                  </div>
                  <div className=" relative">
                    <label htmlFor="upload-nib" className="w-fit">
                      {nibFile === null ? (
                        <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                          <span>
                            <FaCloudUploadAlt />
                          </span>
                          <div>Upload</div>
                        </div>
                      ) : (
                        <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                          <span>
                            <FaCloudUploadAlt />
                          </span>
                          <div>1 File</div>
                        </div>
                      )}
                    </label>
                    <input
                      type="file"
                      onChange={onChangeNibFile}
                      id="upload-nib"
                      accept=".jpg,.pdf"
                      className="hidden w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                    />
                  </div>
                  {nibFileUpload.trim().length > 0 && (
                    <a
                      href={`${apiExport}fin/transactionact/view_portal_file.jsp?file=${nibFileUpload}`}
                      target="_blank"
                      className="underline cursor-pointer text-blue-500"
                      rel="noreferrer"
                    >
                      File terupload
                    </a>
                  )}
                </div>
                {nibFile !== null &&
                RegExp("\\bpdf\\b").test(nibFile.split(",")[0]) ? (
                  <div className="h-[500px] w-[500px] max-[612px]:w-full mb-5">
                    <div className="h-full w-full">
                      <Viewer fileUrl={nibFilePreview} />
                    </div>
                  </div>
                ) : (
                  nibFile !== null && (
                    <div className="h-[500px] w-[400px] max-[612px]:w-full mb-5">
                      <div className="h-full w-full">
                        <img
                          src={nibFilePreview}
                          alt="no"
                          className="w-full h-full"
                        />
                      </div>
                    </div>
                  )
                )}

                <div className="flex flex-col min-[612px]:flex-row gap-5 min-[612px]:gap-2 mb-3 w-full min-[612px]:items-center">
                  <div className="flex flex-col gap-1">
                    <div className=" flex">
                      <label htmlFor="" className="w-72">
                        Sreenshot Rekening Perusahaan
                      </label>
                      <div className="hidden min-[612px]:block">:</div>
                    </div>
                    <div className="text-[10px] text-gray-500">
                      Max size 2 mb
                    </div>
                  </div>
                  <div className=" relative">
                    <label htmlFor="upload-ssperusahaan" className="w-fit">
                      {ssPerusahaanFile === null ? (
                        <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                          <span>
                            <FaCloudUploadAlt />
                          </span>
                          <div>Upload</div>
                        </div>
                      ) : (
                        <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                          <span>
                            <FaCloudUploadAlt />
                          </span>
                          <div>1 File</div>
                        </div>
                      )}
                    </label>
                    <input
                      onChange={onChangeSsRekeningFile}
                      type="file"
                      id="upload-ssperusahaan"
                      accept=".jpg,.pdf"
                      className="hidden w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                    />
                  </div>
                  {ssPerusahaanFileUpload.trim().length > 0 && (
                    <a
                      href={`${apiExport}fin/transactionact/view_portal_file.jsp?file=${ssPerusahaanFileUpload}`}
                      target="_blank"
                      className="underline cursor-pointer text-blue-500"
                      rel="noreferrer"
                    >
                      File terupload
                    </a>
                  )}
                </div>
                {ssPerusahaanFile !== null &&
                RegExp("\\bpdf\\b").test(ssPerusahaanFile.split(",")[0]) ? (
                  <div className="h-[500px] w-[500px] max-[612px]:w-full mb-5">
                    <div className="h-full w-full">
                      <Viewer fileUrl={ssPerusahaanFilePreview} />
                    </div>
                  </div>
                ) : (
                  ssPerusahaanFile !== null && (
                    <div className="h-[500px] w-[400px] max-[612px]:w-full mb-5">
                      <div className="h-full w-full">
                        <img
                          src={ssPerusahaanFilePreview}
                          alt="no"
                          className="w-full h-full"
                        />
                      </div>
                    </div>
                  )
                )}

                <div className="flex flex-col min-[612px]:flex-row gap-5 min-[612px]:gap-2 mb-3 w-full min-[612px]:items-center">
                  <div className="flex flex-col gap-1">
                    <div className=" flex">
                      <label htmlFor="" className="w-72">
                        Sertifikasi BPOM
                      </label>
                      <div className="hidden min-[612px]:block">:</div>
                    </div>
                    <div className="text-[10px] text-gray-500">
                      Max size 1 mb
                    </div>
                    <div className="flex gap-1 items-center text-[12px]">
                      <div>
                        <PiWarningCircleLight />
                      </div>
                      <div>Untuk supplier makanan & minuman</div>
                    </div>
                  </div>

                  <div className=" relative">
                    <label htmlFor="upload-bpom" className="w-fit">
                      {sertifBpomFile === null ? (
                        <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                          <span>
                            <FaCloudUploadAlt />
                          </span>
                          <div>Upload</div>
                        </div>
                      ) : (
                        <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                          <span>
                            <FaCloudUploadAlt />
                          </span>
                          <div>1 File</div>
                        </div>
                      )}
                    </label>
                    <input
                      onChange={onChangeBpomFile}
                      type="file"
                      id="upload-bpom"
                      accept=".jpg,.pdf"
                      className="hidden w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                    />
                  </div>
                  {sertifBpomFileUpload.trim().length > 0 && (
                    <a
                      href={`${apiExport}fin/transactionact/view_portal_file.jsp?file=${npwpFileUpload}`}
                      target="_blank"
                      className="underline cursor-pointer text-blue-500"
                      rel="noreferrer"
                    >
                      File terupload
                    </a>
                  )}
                </div>
                {sertifBpomFile !== null &&
                RegExp("\\bpdf\\b").test(sertifBpomFile.split(",")[0]) ? (
                  <div className="h-[500px] w-[500px] max-[612px]:w-full mb-5">
                    <div className="h-full w-full">
                      <Viewer fileUrl={sertifBpomFilePreview} />
                    </div>
                  </div>
                ) : (
                  sertifBpomFile !== null && (
                    <div className="h-[500px] w-[400px] max-[612px]:w-full mb-5">
                      <div className="h-full w-full">
                        <img
                          src={sertifBpomFilePreview}
                          alt="no"
                          className="w-full h-full"
                        />
                      </div>
                    </div>
                  )
                )}
              </form>
            </div>
          </div>
          {isError && (
            <div className="bg-red-500 py-2 px-5 text-white w-fit">
              {"Error (" + message + ")"}
            </div>
          )}

          <div className="flex justify-start max-[415px]:w-full py-4">
            <button
              type="button"
              disabled={loading ? true : false}
              onClick={updateVendor}
              className={`py-3 max-[415px]:w-full px-10 rounded-md shadow-sm  text-white 
                bg-[#0077b6]
              `}
            >
              {loading ? (
                <CircularProgress size={20} sx={{ color: "white" }} />
              ) : (
                "Simpan"
              )}
            </button>
          </div>
        </div>
      </div>

      <div>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={open}
          onClose={handleClose}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade in={open}>
            <div
              className={`rounded-md border-0 bg-white py-5 px-7 absolute top-[50%] left-1/2 translate-x-[-50%] translate-y-[-50%] h-[400px] overflow-y-auto z-[999999]  ${
                screenSize <= 548 ? "w-[90%]" : "w-fit"
              }`}
            >
              <div className="text-[20px] mb-5 font-semibold ">Reason</div>
              <div className="flex flex-col gap-2"></div>

              <div className="mt-5 flex flex-col gap-2">
                <textarea value={reason} disabled cols="30" rows="5"></textarea>
              </div>

              <div className="mt-5 flex max-[479px]:flex-col max-[479px]:items-start items-center gap-2 text-center justify-between">
                <div
                  onClick={handleClose}
                  className="rounded-md py-2 px-5 shadow-sm border border-gray-400 cursor-pointer max-[479px]:w-full"
                >
                  Back
                </div>
              </div>
            </div>
          </Fade>
        </Modal>
      </div>

      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 9999999999,
        }}
        open={openBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default VendorEdit;
