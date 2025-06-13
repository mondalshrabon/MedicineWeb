import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { RiMedicineBottleLine, RiArrowLeftLine, RiStarFill } from "react-icons/ri";
import { FiClock, FiInfo, FiDroplet, FiTag, FiPackage, FiLayers } from "react-icons/fi";

const MedicineInfo = ({ Theme }) => {
  const { id: Id } = useParams();
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchMedicine = async () => {
      try {
        const docRef = doc(db, "categories", Id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setMedicine(data);
          fetchRelated(data.Brand, docSnap.id);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching medicine:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchRelated = async (brand, currentId) => {
      setRelatedLoading(true);
      try {
        const q = query(collection(db, "categories"), where("Brand", "==", brand));
        const querySnapshot = await getDocs(q);
        const related = [];

        querySnapshot.forEach((doc) => {
          if (doc.id !== currentId) {
            related.push({ id: doc.id, ...doc.data() });
          }
        });

        setRelatedProducts(related);
      } catch (error) {
        console.error("Error fetching related products:", error);
      } finally {
        setRelatedLoading(false);
      }
    };

    if (Id) fetchMedicine();
  }, [Id]);

  const formatNumberedList = (text) => {
    if (!text) return null;
    
    const items = text.split(/(?:\d+\.|\*|\-)\s/g).filter(item => item.trim() !== "");
    
    return (
      <ol className="space-y-3 pl-5 list-decimal">
        {items.map((item, index) => (
          <li key={index} className="text-sm leading-relaxed">
            <span className={`${Theme ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'} px-2 py-1 rounded-full text-xs font-semibold mr-2`}>
              {index + 1}
            </span>
            {item.trim()}
          </li>
        ))}
      </ol>
    );
  };

  const Spinner = () => (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
    </div>
  );

  const InfoCard = ({ icon, title, children }) => (
    <div className={`p-4 sm:p-6 rounded-xl ${Theme ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
      <div className="flex items-center mb-4">
        <div className={`p-2 rounded-lg ${Theme ? 'bg-gray-700' : 'bg-gray-100'} mr-3`}>
          {icon}
        </div>
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>
      <div className="pl-11 sm:pl-12 text-sm sm:text-base">{children}</div>
    </div>
  );

  if (loading) return <Spinner />;

  return (
    <div className={`min-h-screen ${Theme ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <button 
          onClick={() => navigate(-1)}
          className={`flex items-center mb-6 ${Theme ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} transition-colors`}
        >
          <RiArrowLeftLine className="mr-2" /> Back to Search
        </button>

        {medicine ? (
          <div className="space-y-6">
            {/* Medicine Header with Brand Highlight */}
            <div className={`p-4 sm:p-8 rounded-2xl ${Theme ? 'bg-gray-800' : 'bg-white'} shadow-xl`}>
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Medicine Image */}
                <div className="lg:w-2/5 flex flex-col items-center">
                  {medicine.image ? (
                    <img
                      src={medicine.image}
                      alt={medicine.name}
                      className="h-48 sm:h-64 w-full max-w-xs rounded-xl border shadow-lg object-contain mb-4"
                    />
                  ) : (
                    <div className={`h-48 sm:h-64 w-full max-w-xs rounded-xl border shadow-lg flex items-center justify-center ${Theme ? 'bg-gray-700' : 'bg-gray-100'} mb-4`}>
                      <RiMedicineBottleLine className="text-5xl text-gray-400" />
                    </div>
                  )}
                  
                  {/* Brand Badge */}
                  <div className={`w-full max-w-xs p-3 sm:p-4 rounded-lg ${Theme ? 'bg-gray-700' : 'bg-gray-100'} flex items-center`}>
                    <FiLayers className={`text-xl mr-3 ${Theme ? 'text-yellow-400' : 'text-yellow-600'}`} />
                    <div>
                      <p className={`text-xs ${Theme ? 'text-gray-400' : 'text-gray-600'}`}>Manufactured by</p>
                      <h3 className="font-bold text-base sm:text-lg">{medicine.Brand}</h3>
                    </div>
                  </div>
                </div>

                {/* Medicine Details */}
                <div className="lg:w-3/5 space-y-4 sm:space-y-6">
                  <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{medicine.name}</h1>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm ${Theme ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}>
                      <RiStarFill className="mr-1" /> {medicine.Brand}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <InfoCard icon={<FiPackage className="text-blue-500" />} title="Composition">
                      <p className="break-words">{medicine.Composition}</p>
                    </InfoCard>

                    <InfoCard icon={<FiInfo className="text-green-500" />} title="Description">
                      <p className="break-words">{medicine.description}</p>
                    </InfoCard>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Information */}
            {medicine.Dose_Indication && (
              <InfoCard icon={<FiClock className="text-purple-500" />} title="Dosage & Administration">
                {formatNumberedList(medicine.Dose_Indication)}
              </InfoCard>
            )}

            {/* Related Medicines */}
            <div className={`p-4 sm:p-8 rounded-2xl ${Theme ? 'bg-gray-800' : 'bg-white'} shadow-xl`}>
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center">
                <FiTag className={`mr-3 ${Theme ? 'text-yellow-400' : 'text-yellow-600'}`} />
                <span>Other Products by <span className="text-blue-500">{medicine.Brand}</span></span>
              </h2>

              {relatedLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className={`p-4 rounded-lg ${Theme ? 'bg-gray-700' : 'bg-gray-100'} animate-pulse h-20 sm:h-24`}></div>
                  ))}
                </div>
              ) : relatedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {relatedProducts.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        navigate(`/admin/medicine/${item.id}`);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className={`p-3 sm:p-4 rounded-lg cursor-pointer transition-all ${Theme ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} border ${Theme ? 'border-gray-700' : 'border-gray-200'} group`}
                    >
                      <h3 className="font-medium text-sm sm:text-base group-hover:text-blue-500 transition-colors">{item.name}</h3>
                      <p className={`text-xs sm:text-sm mt-1 ${Theme ? 'text-gray-400' : 'text-gray-600'} break-words`}>{item.Composition}</p>
                      <div className={`mt-2 text-xs px-2 py-1 rounded-full inline-block ${Theme ? 'bg-gray-700 text-blue-300' : 'bg-gray-100 text-blue-600'}`}>
                        {item.Brand}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`text-center py-8 sm:py-12 rounded-lg ${Theme ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <p className={`${Theme ? 'text-gray-400' : 'text-gray-600'}`}>No other products found from this brand</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={`text-center py-16 sm:py-32 rounded-xl ${Theme ? 'bg-gray-800' : 'bg-white'} shadow-xl`}>
            <RiMedicineBottleLine className="mx-auto text-5xl sm:text-6xl text-gray-400 mb-4 sm:mb-6" />
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Medicine Not Found</h2>
            <p className={`text-base sm:text-lg ${Theme ? 'text-gray-400' : 'text-gray-600'} max-w-md mx-auto px-4`}>
              The requested medicine information is not available or may have been removed from our database.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicineInfo;