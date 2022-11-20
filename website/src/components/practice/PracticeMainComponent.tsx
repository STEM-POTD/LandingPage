import React from "react";
import { trpc } from "utils/trpc"

const PracticeMainComponent = () => {
    const { data: problems, isFetching, isLoading } = trpc.getProblemsBySubject.useQuery({ subject: "math" });
    return (
        <div className="mt-24">
            <h1 className="text-lg font-bold">Practice Problems</h1>
            {isLoading && <p>Loading...</p>}
            {isFetching && <p>Updating...</p>}
            {problems && problems.map((problem) => (
                <div key={problem.id}>
                    <h2>{problem.title}</h2>
                    <p>{problem.content}</p>
                </div>
            ))}
        </div>
    );
};

export default PracticeMainComponent;