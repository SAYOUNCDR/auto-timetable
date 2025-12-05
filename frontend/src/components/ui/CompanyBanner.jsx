import LPU from "../Logos/LPU.svg";

const CompanyBanner = () => {
  const Companies = [{ name: "LPU", logo: LPU }];
  return (
    <div className="w-full flex flex-col items-center justify-center mt-20 mb-10">
      <p className="text-gray-500">Trusted by companies like</p>
      <div className="flex gap-10">
        {Companies.map((company, index) => (
          <div key={index}>
            <img
              src={company.logo}
              alt={company.name}
              className="h-30 object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyBanner;
