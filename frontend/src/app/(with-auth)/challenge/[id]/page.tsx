"use client";
import React from 'react'


const ChallengeIdPage = ({ params: { id } }: { params: { id: string } }) => {
  console.log(id);

  return <div>Challenge Page {id}</div>;
};

export default ChallengeIdPage