import React from "react";
import { trpc } from "../../utils/trpc";

const PracticeMainComponent = () => {
    const { data, isLoading, isFetching } = trpc.getProblemsBySubject.useQuery({ subject: "Math"});
    return (
        <div>
            <h1>Practice Problems</h1>
            {isLoading && <div>Loading...</div>}
            {isFetching && <div>Updating...</div>}
            {data && data.map((problem) => (
                <div key={problem.id}>
                    <h2>{problem.title}</h2>
                    <p>{problem.content}</p>
                </div>
            ))}
        </div>
    );
}

export default PracticeMainComponent;