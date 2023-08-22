import { Link } from "react-router-dom";
import { useStateContext } from "../../contexts/ContextProvider";
import Admin from "../../layouts/Admin";
import questionImg from "../../assets/images/question.png";
import vendorImg from "../../assets/images/vendor.png";
import { useEffect, useRef, useState } from "react";
import Select from "react-select";
import dayjs from "dayjs";
//import { MdKeyboardArrowDown } from "react-icons/md";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

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
  const { screenSize, isRegistration } = useStateContext();

  const [npwp, setNpwp] = useState("");
  const [statusPajak, setStatusPajak] = useState({
    value: "01",
    label: "Perusahaan Kena Pajak (PKP)",
    key: "01",
  });
  const [whatsappKeuangan, setWhatsappKeuangan] = useState("");
  const [whatsappPO, setWhatsappPO] = useState("");
  const [termPembayaran, setTermPembayaran] = useState("");
  const [pengembalianBarang, setPengembalianBarang] = useState(
    dayjs(new Date())
  );
  const [marketingFee, setMarketingFee] = useState("");

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

  useEffect(() => {
    window.scrollTo(0, 0);
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

  const onChangeMarketingFee = (e) => {
    e.target.validity.valid
      ? setMarketingFee(e.target.value)
      : setMarketingFee("");
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
        className={`${screenSize < 768 ? "px-5 pt-20" : "px-10"} ${
          !isRegistration ? "h-screen" : "pt-20"
        } font-roboto `}
      >
        {!isRegistration ? (
          <div className="flex flex-col justify-center items-center h-full mt-[-50px]">
            <div
              style={{ backgroundImage: `url(${questionImg})` }}
              className="bg-cover bg-center w-[300px] h-[200px]"
            ></div>
            <div>
              Silahkan registrasi terlebih dahulu, klik{" "}
              <span className="underline text-blue-500">
                <Link to="/registration">disini.</Link>
              </span>{" "}
            </div>
          </div>
        ) : (
          <div className="bg-white px-3">
            <div className="flex flex-col items-center gap-5">
              <div
                className="bg-cover bg-center w-[450px] max-[497px]:w-full h-[450px]"
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
                                  className="whitespace-nowrap"
                                  options={options}
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
                                  options={options}
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
                                  className="whitespace-nowrap"
                                  options={options}
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
                                  options={options}
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
                    <div className="whitespace-nowrap flex">
                      <label htmlFor="" className="w-72">
                        Listing Fee
                      </label>
                      <div className="hidden min-[612px]:block">:</div>
                    </div>
                    <div className="w-full relative">
                      <input
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
                        Promotion Fund
                      </label>
                      <div className="hidden min-[612px]:block">:</div>
                    </div>
                    <div className="w-full relative">
                      <input
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
              <button className="py-3 max-[415px]:w-full px-10 rounded-sm shadow-sm bg-[#0077b6] text-white">Simpan</button>
            </div>
          </div>
        )}
      </div>
    </Admin>
  );
};

export default Profile;
