import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import Cards from "../components/Cards";
import TransactionForm from "../components/TransactionForm";

import { MdLogout } from "react-icons/md";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "@apollo/client";
import { LOGOUT } from "../graphql/mutations/user.mutation";
import { GET_TRANSACTION_STATISTICS } from "../graphql/queries/transaction.query";
import { GET_AUTHENTICATED_USER } from "../graphql/queries/user.query";
import { GET_AI_RESPONSE } from "../graphql/mutations/transaction.mutation";
import { useEffect, useState } from "react";


ChartJS.register(ArcElement, Tooltip, Legend);

const HomePage = () => {
	const { data } = useQuery(GET_TRANSACTION_STATISTICS);
	const { data: authUserData } = useQuery(GET_AUTHENTICATED_USER);
	const [getAIResponse, { loading: aiLoading }] = useMutation(GET_AI_RESPONSE);
	const [aiAdvice, setAiAdvice] = useState("");
	const [showModal, setShowModal] = useState(false);

	const [logout, { loading, client }] = useMutation(LOGOUT, {
		refetchQueries: ["GetAuthenticatedUser"],
	});

	const [chartData, setChartData] = useState({
		labels: [],
		datasets: [
			{
				label: "$",
				data: [],
				backgroundColor: [],
				borderColor: [],
				borderWidth: 1,
				borderRadius: 30,
				spacing: 10,
				cutout: 130,
			},
		],
	});

	useEffect(() => {
		if (data?.categoryStatistics) {
			const categories = data.categoryStatistics.map((stat) => stat.category);
			const totalAmounts = data.categoryStatistics.map((stat) => stat.totalAmount);

			const backgroundColors = [];
			const borderColors = [];

			categories.forEach((category) => {
				if (category === "saving") {
					backgroundColors.push("rgba(75, 192, 192)");
					borderColors.push("rgba(75, 192, 192)");
				} else if (category === "expense") {
					backgroundColors.push("rgba(255, 99, 132)");
					borderColors.push("rgba(255, 99, 132)");
				} else if (category === "investment") {
					backgroundColors.push("rgba(54, 162, 235)");
					borderColors.push("rgba(54, 162, 235)");
				}
			});

			setChartData((prev) => ({
				labels: categories,
				datasets: [
					{
						...prev.datasets[0],
						data: totalAmounts,
						backgroundColor: backgroundColors,
						borderColor: borderColors,
					},
				],
			}));
		}
	}, [data]);

	const handleLogout = async () => {
		try {
			await logout();
			// Clear the Apollo Client cache FROM THE DOCS
			// https://www.apollographql.com/docs/react/caching/advanced-topics/#:~:text=Resetting%20the%20cache,any%20of%20your%20active%20queries
			client.resetStore();
		} catch (error) {
			console.error("Error logging out:", error);
			toast.error(error.message);
		}
	};

	const handleAnalyzeWithAI = async () => {
		try {
		  const { data } = await getAIResponse();
		  setAiAdvice(data.getAIResponse);
		  setShowModal(true);
		} catch (error) {
		  toast.error("Failed to get AI analysis");
		  console.error(error);
		}
	  };

	return (
		<>
			<div className='flex flex-col gap-1 items-center max-w-7xl mx-auto z-20 relative justify-center'>
				<div className='flex items-center'>
					<p className='md:text-4xl text-2xl lg:text-4xl font-bold text-center relative z-50 mb-4 mr-4 bg-gradient-to-r from-pink-600 via-indigo-500 to-pink-400 inline-block text-transparent bg-clip-text'>
						Spend wisely, track wisely
					</p>
					<img
						src={authUserData?.authUser.profilePicture}
						className='w-11 h-11 rounded-full border cursor-pointer'
						alt='Avatar'
					/>
					{!loading && <MdLogout className='mx-2 w-5 h-5 cursor-pointer' onClick={handleLogout} />}
					{/* loading spinner */}
					{loading && <div className='w-6 h-6 border-t-2 border-b-2 mx-2 rounded-full animate-spin'></div>}
				</div>
				<div className='flex flex-wrap w-full justify-center items-center gap-1'>
					{data?.categoryStatistics.length > 0 && (
						<div className='h-[330px] w-[330px] md:h-[360px] md:w-[360px]  '>
							<Doughnut data={chartData} />
						</div>
					)}

					<TransactionForm />
				</div>
				<Cards />


			{/* Add the AI Analysis Button */}
        <button
          onClick={handleAnalyzeWithAI}
          disabled={aiLoading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-full shadow-lg transition-colors duration-300"
        >
          {aiLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </span>
          ) : (
            "Analyze Using AI"
          )}
        </button>
      </div>

{/* AI Advice Modal - Updated Dark Theme */}
{showModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    {/* Background overlay - darker */}
    <div 
      className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm"
      onClick={() => setShowModal(false)}
    ></div>
    
    {/* Modal container - larger and dark */}
    <div className="relative bg-gray-900 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-700">
      {/* Modal header - dark with visible close button */}
      <div className="flex justify-between items-center p-4 border-b border-gray-700 bg-gray-800">
        <h3 className="text-lg font-semibold text-white">AI Financial Analysis</h3>
        <button 
          onClick={() => setShowModal(false)}
          className="p-1 rounded-full hover:bg-gray-700 transition-colors text-gray-300 hover:text-white"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Modal content - dark theme with code-like formatting */}
      <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)] font-mono">
        {aiAdvice ? (
          <div className="text-gray-200 whitespace-pre-wrap">
            {aiAdvice.split('\n').map((paragraph, index) => {
              // Format different parts of the response
              if (paragraph.startsWith('**')) {
                return (
                  <h4 key={index} className="text-indigo-400 font-semibold mt-4 mb-2">
                    {paragraph.replace(/\*\*/g, '')}
                  </h4>
                );
              } else if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
                return (
                  <div key={index} className="flex items-start mb-2">
                    <span className="text-gray-500 mr-2">•</span>
                    <span>{paragraph.substring(2)}</span>
                  </div>
                );
              } else if (paragraph.trim() === '') {
                return <br key={index} />;
              } else {
                return (
                  <p key={index} className="mb-4 text-gray-300">
                    {paragraph}
                  </p>
                );
              }
            })}
          </div>
        ) : (
          <p className="text-gray-500">Generating analysis...</p>
        )}
      </div>
      

    </div>
  </div>
)}
    </>
  );
};

export default HomePage;