
import { useStateContext } from "../../contexts/ContextProvider";
import Admin from "../../layouts/Admin";
import vendorImg from "../../assets/images/vendor.png";
import { useEffect, useRef, useState } from "react";
import Select from "react-select";
import dayjs from "dayjs";
//import { MdKeyboardArrowDown } from "react-icons/md";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ApiDataWilayahIndonesia from "../../api/ApiDataWilayahIndonesia";

const options = [
  { value: "CV", label: "CV", key: 1 },
  { value: "PT", label: "PT", key: 2 },
];

const optionTipePembelian = [
  { value: "01", label: "Konsinyasi", key: 1 },
  { value: "02", label: "Beli Putus", key: 2 },
];

const optionStatusPajak = [
  { value: "01", label: "Perusahaan Kena Pajak (PKP)", key: 1 },
  { value: "02", label: "Non Perusahaan Kena Pajak (NPKP)", key: 2 },
];

const optionMetodePengiriman = [
  { value: "01", label: "Darat", key: 1 },
  { value: "02", label: "Laut", key: 2 },
  { value: "03", label: "Udara", key: 2 },
];

const Profile = () => {
  const { screenSize } = useStateContext();
  const [optionProvinsi, setOptionProvinsi] = useState([]);
  const [optionKota, setOptionKota] = useState([]);

  const [tipePerusahaan, setTipePerusahaan] = useState({});
  const [namaPerusahaan, setNamaPerusahaan] = useState("");
  const [alamat, setAlamat] = useState("");
  const [provinsi, setProvinsi] = useState({});
  const [kota, setKota] = useState({});
  const [kodePos, setKodePos] = useState("");
  const [tipePembelian, setTipePembelian] = useState({});
  const [npwp, setNpwp] = useState("");
  const [statusPajak, setStatusPajak] = useState({
    value: "01",
    label: "Perusahaan Kena Pajak (PKP)",
    key: "01",
  });
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
  const [bank, setBank] = useState("");
  const [nomorRekening, setRekening] = useState("");
  const [namaRekening, setNamaRekening] = useState("");
  const [kantorCabangBank, setKantorCabangBank] = useState("");
  const [metodePengiriman, setMetodePengiriman] = useState({});
  const [pengembalianBarang, setPengembalianBarang] = useState({});
  const [rebate, setRebate] = useState("");
  const [marketingFee, setMarketingFee] = useState("");
  const [listingFee, setListingFee] = useState("");
  const [promotionFund, setPromotionFund] = useState("");

  const [, setNpwpFile] = useState(null);
  const [, setKtpPemilikFIle] = useState(null);
  const [, setKtpPenanggungJawabFile] = useState(null);
  const [, setSpkpFile] = useState(null);
  const [, setSiupFile] = useState(null);
  const [, setNibFile] = useState(null);
  const [, setSsPerusahaanFile] = useState(null);
  const [, setSertifBpomFile] = useState(null);

  const company_section = useRef();

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
          value: item.id,
          label: item.name,
          key: item.id,
        });
      });

      setOptionProvinsi(provinsiValue);
    });
  };

  const fetchKota = async (id) => {
    await ApiDataWilayahIndonesia.get(`regencies/${id}.json`).then(
      (response) => {
        const optionsValue = response.data.map((item, i) => {
          const optionCopy = [...optionKota];
          return (optionCopy[i] = {
            value: item.id,
            label: item.name,
            key: item.id,
          });
        });

        setOptionKota(optionsValue);
      }
    );
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setPengembalianBarang(dayjs(new Date()));
    fetchProvince();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatNpwp = (value) => {
    try {
      var cleaned = ("" + value).replace(/\D/g, "");
      var match = cleaned.match(
        /(\d{0,2})?(\d{0,3})?(\d{0,3})?(\d{0,1})?(\d{0,3})?(\d{0,3})$/
      );

      var nilai = [
        match[1],
        match[2] ? "." : "",
        match[2],
        match[3] ? "." : "",
        match[3],
        match[4] ? "." : "",
        match[4],
        match[5] ? "-" : "",
        match[5],
        match[6] ? "." : "",
        match[6],
      ].join("");
      setNpwp(nilai);
    } catch (err) {
      return "";
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

  const onChangePengembalianBarang = (newValue) => {
    setPengembalianBarang(newValue);
  };

  const onChangeProvinsi = (item) => {
    if (provinsi.value !== item.value) {
      setProvinsi(item);
      setKota({});

      fetchKota(item.value);
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

  // const onClickCompany = () => {
  //   companySection
  //     ? company_section.current.classList.add("hidden")
  //     : company_section.current.classList.remove("hidden");

  //   setCompanySection((prev) => !prev);
  // };

  return (
    <Admin>
      {console.log(pengembalianBarang)}
      <div
        className={`${
          screenSize < 768 ? "px-5 pt-20" : "px-10"
        } pt-20 font-roboto `}
      >
        <div className="bg-white px-3">
          <div className="flex flex-col items-center gap-5">
            <div
              className="bg-cover bg-center w-[300px] max-[497px]:w-[200px] max-[497px]:h-[200px] h-[300px]"
              style={{ backgroundImage: `url(${vendorImg})` }}
            ></div>
            <div className="w-full">
              <div className="mt-10">
                <div className="bg-white mb-3 font-semibold">
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
                            <div className="whitespace-nowrap flex">
                              <label htmlFor="" className="w-72">
                                Tipe Perusahaan
                              </label>
                              <div>:</div>
                            </div>
                            <div className="w-full relative">
                              <Select
                                value={tipePerusahaan}
                                onChange={(item) => setTipePerusahaan(item)}
                                className="whitespace-nowrap"
                                options={options}
                                noOptionsMessage={() => "Data not found"}
                                styles={customeStyles}
                                placeholder="Pilih Tipe Perusahaan..."
                                required
                              />
                            </div>
                          </div>
                          <div className="flex gap-2 items-center mb-3 w-full">
                            <div className="whitespace-nowrap flex">
                              <label htmlFor="" className="w-72">
                                Nama Perusahaan
                              </label>
                              <div>:</div>
                            </div>
                            <div className="w-full relative">
                              <input
                                value={namaPerusahaan}
                                onChange={(e) =>
                                  setNamaPerusahaan(e.target.value)
                                }
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
                          <div className="flex flex-col gap-2 mb-3 w-full">
                            <div className="whitespace-nowrap flex">
                              <label htmlFor="" className="w-72">
                                Tipe Perusahaan
                              </label>
                            </div>
                            <div className="w-full relative">
                              <Select
                                value={tipePerusahaan}
                                onChange={(item) => setTipePerusahaan(item)}
                                className="whitespace-nowrap"
                                options={options}
                                noOptionsMessage={() => "Data not found"}
                                styles={customeStyles}
                                placeholder="Pilih Tipe Perusahaan..."
                                required
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 mb-3 w-full">
                            <div className="whitespace-nowrap flex">
                              <label htmlFor="" className="w-72">
                                Nama Perusahaan
                              </label>
                            </div>
                            <div className="w-full relative">
                              <input
                                value={namaPerusahaan}
                                onChange={(e) =>
                                  setNamaPerusahaan(e.target.value)
                                }
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
                            <div className="whitespace-nowrap flex">
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
                                className="whitespace-nowrap"
                                noOptionsMessage={() => "Provinsi not found"}
                                styles={customeStyles}
                                placeholder="Pilih Provinsi..."
                                required
                              />
                            </div>
                          </div>
                          <div className="flex gap-2 items-center mb-3 w-full">
                            <div className="whitespace-nowrap flex">
                              <label htmlFor="" className="w-72">
                                Kota
                              </label>
                              <div>:</div>
                            </div>
                            <div className="w-full relative">
                              <Select
                                className="whitespace-nowrap"
                                value={kota}
                                onChange={(item) => setKota(item)}
                                options={optionKota}
                                noOptionsMessage={() => "Kota not found"}
                                styles={customeStyles}
                                placeholder="Pilih Kota..."
                                required
                              />
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex gap-2 flex-col mb-3 w-full">
                            <div className="whitespace-nowrap flex">
                              <label htmlFor="" className="w-72">
                                Provinsi
                              </label>
                            </div>
                            <div className="w-full relative">
                              <Select
                                value={provinsi}
                                onChange={onChangeProvinsi}
                                options={optionProvinsi}
                                className="whitespace-nowrap"
                                noOptionsMessage={() => "Provinsi not found"}
                                styles={customeStyles}
                                placeholder="Pilih Provinsi..."
                                required
                              />
                            </div>
                          </div>
                          <div className="flex gap-2 flex-col mb-3 w-full">
                            <div className="whitespace-nowrap flex">
                              <label htmlFor="" className="w-72">
                                Kota
                              </label>
                            </div>
                            <div className="w-full relative">
                              <Select
                                className="whitespace-nowrap"
                                value={kota}
                                onChange={(item) => setKota(item)}
                                options={optionKota}
                                noOptionsMessage={() => "Kota not found"}
                                styles={customeStyles}
                                placeholder="Pilih Kota..."
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
                            <div className="whitespace-nowrap flex">
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
                            <div className="whitespace-nowrap flex">
                              <label htmlFor="" className="w-72">
                                Tipe Pembelian
                              </label>
                              <div>:</div>
                            </div>
                            <div className="w-full relative">
                              <Select
                                value={tipePembelian}
                                onChange={(item) => setTipePembelian(item)}
                                className="whitespace-nowrap"
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
                            <div className="whitespace-nowrap flex">
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
                            <div className="whitespace-nowrap flex">
                              <label htmlFor="" className="w-72">
                                Tipe Pembelian
                              </label>
                            </div>
                            <div className="w-full relative">
                              <Select
                                value={tipePembelian}
                                onChange={(item) => setTipePembelian(item)}
                                className="whitespace-nowrap"
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
                            <div className="whitespace-nowrap flex">
                              <label htmlFor="" className="w-72">
                                Status Pajak
                              </label>
                              <div>:</div>
                            </div>
                            <div className="w-full relative">
                              <Select
                                className="whitespace-nowrap"
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

                          <div className="flex gap-2 items-center mb-3 w-full">
                            <div className="whitespace-nowrap flex">
                              <label htmlFor="" className="w-72">
                                NPWP
                              </label>
                              <div>:</div>
                            </div>
                            <div className="w-full relative">
                              <input
                                maxLength={20}
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
                            <div className="whitespace-nowrap flex">
                              <label htmlFor="" className="w-72">
                                Status Pajak
                              </label>
                            </div>
                            <div className="w-full relative">
                              <Select
                                className="whitespace-nowrap"
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
                            <div className="whitespace-nowrap flex">
                              <label htmlFor="" className="w-72">
                                NPWP
                              </label>
                            </div>
                            <div className="w-full relative">
                              <input
                                maxLength={20}
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
                        <div className="whitespace-nowrap flex">
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
                        <div className="whitespace-nowrap flex">
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
                        <div className="whitespace-nowrap flex">
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
                        <div className="whitespace-nowrap flex">
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
            <div className="bg-white mb-3 font-semibold">
              <div>Contact Person</div>
            </div>
            <div
              id="contact-section"
              className="py-2 bg-white transition-all duration-200 ease-in"
            >
              <form action="">
                <div className="flex flex-col min-[612px]:flex-row gap-5 min-[612px]:gap-2 mb-3 w-full min-[612px]:items-center">
                  <div className="whitespace-nowrap flex">
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
                  <div className="whitespace-nowrap flex">
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
                  <div className="whitespace-nowrap flex">
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
                  <div className="whitespace-nowrap flex">
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
                  <div className="whitespace-nowrap flex">
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
                  <div className="whitespace-nowrap flex">
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
                  <div className="whitespace-nowrap flex">
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
                  <div className="whitespace-nowrap flex">
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
                  <div className="whitespace-nowrap flex">
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
                  <div className="whitespace-nowrap flex">
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
                  <div className="whitespace-nowrap flex">
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
                  <div className="whitespace-nowrap flex">
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
            <div className="bg-white mb-3 font-semibold">
              <div>Payment</div>
            </div>
            <div
              id="contact-section"
              className="py-2 bg-white transition-all duration-200 ease-in"
            >
              <form action="">
                <div className="underline ">Detail Pembayaran</div>
                <div className="flex flex-col min-[612px]:flex-row gap-5 min-[612px]:gap-2 mb-3 w-full min-[612px]:items-center mt-2">
                  <div className="whitespace-nowrap flex">
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
                  <div className="whitespace-nowrap flex">
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
                  <div className="whitespace-nowrap flex">
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
                  <div className="whitespace-nowrap flex">
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
                  <div className="whitespace-nowrap flex">
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
                  <div className="whitespace-nowrap flex">
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
                <div className="flex flex-col min-[612px]:flex-row gap-5 min-[612px]:gap-2 mb-3 w-full min-[612px]:items-center">
                  <div className="whitespace-nowrap flex">
                    <label htmlFor="" className="w-72">
                      Pengembalian Barang
                    </label>
                    <div className="hidden min-[612px]:block">:</div>
                  </div>
                  <div className="w-full relative">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["DatePicker"]}>
                        <DatePicker
                          className="w-full"
                          value={pengembalianBarang}
                          onChange={onChangePengembalianBarang}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                    <span className="text-[12px]">
                      bulan sebelum expired atau kadaluwarsa
                    </span>
                  </div>
                </div>

                <div className="flex flex-col min-[612px]:flex-row gap-5 min-[612px]:gap-2 mb-3 w-full min-[612px]:items-center mt-10">
                  <div className="whitespace-nowrap flex">
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
                  <div className="whitespace-nowrap flex">
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
                        (evt.key === "e" || evt.key === "-" ) &&
                        evt.preventDefault()
                      }
                      className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                    />
                  </div>
                </div>
                <div className="flex flex-col min-[612px]:flex-row gap-5 min-[612px]:gap-2 mb-3 w-full min-[612px]:items-center">
                  <div className="whitespace-nowrap flex">
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
                  <div className="whitespace-nowrap flex">
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
            </div>
          </div>

          <div className="mt-2">
            <div className="bg-white mb-3 font-semibold">
              <div>Document</div>
            </div>
            <div
              id="contact-section"
              className="py-2 bg-white transition-all duration-200 ease-in"
            >
              <form action="">
                <div className="flex flex-col min-[612px]:flex-row gap-5 min-[612px]:gap-2 mb-3 w-full min-[612px]:items-center">
                  <div className="whitespace-nowrap flex">
                    <label htmlFor="" className="w-72">
                      NPWP / Surat Keterangan Bebas Pajak
                    </label>
                    <div className="hidden min-[612px]:block">:</div>
                  </div>
                  <div className="w-full relative">
                    <input
                      type="file"
                      onChange={(e) => setNpwpFile(e.target.files[0])}
                      id="upload-npwp"
                      accept="image/jpg,.pdf"
                      className=" w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                    />
                  </div>
                </div>
                <div className="flex flex-col min-[612px]:flex-row gap-5 min-[612px]:gap-2 mb-3 w-full min-[612px]:items-center">
                  <div className="whitespace-nowrap flex">
                    <label htmlFor="" className="w-72">
                      KTP Pemilik
                    </label>
                    <div className="hidden min-[612px]:block">:</div>
                  </div>
                  <div className="w-full relative">
                    <input
                    onChange={(e) => setKtpPemilikFIle(e.target.files[0])}
                      type="file"
                      id="upload-npwp"
                      accept="image/jpg,.pdf"
                      className=" w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                    />
                  </div>
                </div>
                <div className="flex flex-col min-[612px]:flex-row gap-5 min-[612px]:gap-2 mb-3 w-full min-[612px]:items-center">
                  <div className="whitespace-nowrap flex">
                    <label htmlFor="" className="w-72">
                      KTP Penanggung Jawab
                    </label>
                    <div className="hidden min-[612px]:block">:</div>
                  </div>
                  <div className="w-full relative">
                    <input
                    onChange={(e) =>
                      setKtpPenanggungJawabFile(e.target.files[0])
                    }
                      type="file"
                      id="upload-npwp"
                      accept="image/jpg,.pdf"
                      className=" w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                    />
                  </div>
                </div>
                <div className="flex flex-col min-[612px]:flex-row gap-5 min-[612px]:gap-2 mb-3 w-full min-[612px]:items-center">
                  <div className="whitespace-nowrap flex">
                    <label htmlFor="" className="w-72">
                      Surat Pengukuhan Kena Pajak (SPKP)
                    </label>
                    <div className="hidden min-[612px]:block">:</div>
                  </div>
                  <div className="w-full relative">
                    <input
                      type="file"
                      onChange={(e) => setSpkpFile(e.target.files[0])}
                      id="upload-npwp"
                      accept="image/jpg,.pdf"
                      className=" w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                    />
                  </div>
                </div>
                <div className="flex flex-col min-[612px]:flex-row gap-5 min-[612px]:gap-2 mb-3 w-full min-[612px]:items-center mt-2">
                  <div className="whitespace-nowrap flex">
                    <label htmlFor="" className="w-72">
                      Surat Ijin Usaha Perdagangan (SIUP)
                    </label>
                    <div className="hidden min-[612px]:block">:</div>
                  </div>
                  <div className="w-full relative">
                    <input
                    onChange={(e) => setSiupFile(e.target.files[0])}
                      type="file"
                      id="upload-npwp"
                      accept="image/jpg,.pdf"
                      className=" w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                    />
                  </div>
                </div>
                <div className="flex flex-col min-[612px]:flex-row gap-5 min-[612px]:gap-2 mb-3 w-full min-[612px]:items-center">
                  <div className="whitespace-nowrap flex">
                    <label htmlFor="" className="w-72">
                      Nomor Induk Berusaha (NIB)
                    </label>
                    <div className="hidden min-[612px]:block">:</div>
                  </div>
                  <div className="w-full relative">
                    <input
                      type="file"
                      onChange={(e) => setNibFile(e.target.files[0])}
                      id="upload-npwp"
                      accept="image/jpg,.pdf"
                      className=" w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                    />
                  </div>
                </div>
                <div className="flex flex-col min-[612px]:flex-row gap-5 min-[612px]:gap-2 mb-3 w-full min-[612px]:items-center">
                  <div className="whitespace-nowrap flex">
                    <label htmlFor="" className="w-72">
                      Screenshoot Rekening Perushaaan
                    </label>
                    <div className="hidden min-[612px]:block">:</div>
                  </div>
                  <div className="w-full relative">
                    <input
                    onChange={(e) =>
                      setSsPerusahaanFile(e.target.files[0])
                    }
                      type="file"
                      id="upload-npwp"
                      accept="image/jpg,.pdf"
                      className=" w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                    />
                  </div>
                </div>
                <div className="flex flex-col min-[612px]:flex-row gap-5 min-[612px]:gap-2 mb-3 w-full min-[612px]:items-center">
                  <div className="whitespace-nowrap flex">
                    <label htmlFor="" className="w-72">
                      Sertifikasi BPOM
                    </label>
                    <div className="hidden min-[612px]:block">:</div>
                  </div>
                  <div className="w-full relative">
                    <input
                    onChange={(e) => setSertifBpomFile(e.target.files[0])}
                      type="file"
                      id="upload-npwp"
                      accept="image/jpg,.pdf"
                      className=" w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="flex justify-start max-[415px]:w-full py-4">
            <button className="py-3 max-[415px]:w-full px-10 rounded-sm shadow-sm bg-[#0077b6] text-white">
              Simpan
            </button>
          </div>
        </div>
      </div>
    </Admin>
  );
};

export default Profile;
