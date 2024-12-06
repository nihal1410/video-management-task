import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Dashboard() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    axios.get("/api/videos").then((res) => setVideos(res.data));
  }, []);

  return (
    <div>
      <div className="p-4 bg-gray-800 text-white">
        <h1 className="text-2xl">Dashboard</h1>
      </div>
      <div className="p-4">
        <Link to="/record">
          <button className="rounded-sm p-2 bg-blue-600 text-white">
            Record Video
          </button>
        </Link>
      </div>
      {videos.length > 0 && (
        <div className="p-4">
          <table className="table-auto border-collapse border border-gray-300 w-full mt-4">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Date</th>
                <th className="border border-gray-300 px-4 py-2">Play</th>
              </tr>
            </thead>
            <tbody>
              {videos.map((video, index) => (
                <tr key={index} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">
                    {video.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(video.timestamp).toDateString() +
                      " : " +
                      new Date(video.timestamp).toTimeString().split(" ")[0]}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <Link to={`/player/${video.name}`}>
                      <button className="rounded-sm px-4 py-2 bg-blue-600 text-white">
                        Play
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
