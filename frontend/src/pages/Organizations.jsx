import React, { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import useStore from '../store/todoStore';
import { useState } from 'react';
import { useOrgStore } from '../store/org.store';
import { useAuth } from '../store/auth.store';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase';

export const Organizations = () => {
  const {  createAndAssignTask} = useStore();
  const inputRef = useRef(null);
  const { createOrg, orgs, fetchOrgs, addMemberToOrg, assignTask } = useOrgStore(); // Added assignTask
  const [add, setAdd] = useState(false);
  const [expandedOrg, setExpandedOrg] = useState(null);
  const [addingMemberToOrg, setAddingMemberToOrg] = useState(null);
  const [showTaskAssignmentPopup, setShowTaskAssignmentPopup] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const { currentUser, loading } = useAuth();

  const { register, handleSubmit } = useForm({
    defaultValues: {
      orgName: "",
      creator: currentUser.email
    }
  });

  const { register: registerMember, handleSubmit: handleSubmitMember, reset: resetMemberForm } = useForm({
    defaultValues: {
      memberEmail: ""
    }
  });

  const onSubmit = (data) => {
    console.log("onSubmit");
    console.log(data)
    createOrg(data);
    setAdd(false);
  }

  const onAddMember = (data) => {
    if (addingMemberToOrg !== null) {
      const memberData = {
        email: data.memberEmail,
      };

      console.log(data);
      console.log(orgs[addingMemberToOrg]);

      addMemberToOrg(orgs[addingMemberToOrg]._id, memberData);

      setAddingMemberToOrg(null);
      resetMemberForm();
    }
  }

  const toggleOrgExpansion = (index) => {
    setExpandedOrg(expandedOrg === index ? null : index);
  }

  const startAddingMember = (orgIndex) => {
    setAddingMemberToOrg(orgIndex);
  }

  const cancelAddingMember = () => {
    setAddingMemberToOrg(null);
    resetMemberForm();
  }

  // Task Assignment Functions
  const openTaskAssignmentPopup = (orgIndex) => {
    setSelectedOrg(orgs[orgIndex]);
    setShowTaskAssignmentPopup(true);
    setSelectedMembers([]);
    setTaskTitle('');
    setTaskDescription('');
  }

  const closeTaskAssignmentPopup = () => {
    setShowTaskAssignmentPopup(false);
    setSelectedOrg(null);
    setSelectedMembers([]);
    setTaskTitle('');
    setTaskDescription('');
  }

  const toggleMemberSelection = (member) => {
    setSelectedMembers(prev => {
      const isSelected = prev.some(m => (m.email || m) === (member.email || member));
      if (isSelected) {
        return prev.filter(m => (m.email || m) !== (member.email || member));
      } else {
        return [...prev, member];
      }
    });
  }

  const handleTaskAssignment = async () => {
    if (!taskTitle.trim() || selectedMembers.length === 0) {
      alert('Please enter a task title and select at least one member');
      return;
    }

    const taskData = {
      title: taskTitle,
      description: taskDescription,
      assignedTo: selectedMembers,
      orgId: selectedOrg._id,
      userId: currentUser.uid
    };

    try {
      await createAndAssignTask(taskData);
      console.log('Task assigned:', taskData);
      closeTaskAssignmentPopup();
    } catch (error) {
      console.error('Error assigning task:', error);
    }
  }

  useEffect(() => {
    if (add && inputRef.current) {
      inputRef.current.focus();
    }
  }, [add]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User authenticated:", user.email);
        // Wait a bit for token to be ready
        setTimeout(() => {
          fetchOrgs(user.email);
        }, 1000);
      } else {
        console.log("No authenticated user");
      }
    });

    return () => unsubscribe();
  }, []);

  return (

    <div className='h-full bg-[#FAFCFF] w-full lg:w-4/5 m-0 lg:m-4'>
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between mt-6 relative p-4 lg:p-0 pt-8'>
        <h2 className='text-black text-3xl font-bold mb-4 sm:mb-0 sm:ml-8'>Organizations</h2>

        <button 
          className={`group relative flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm sm:text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mr-4 ${
            add 
              ? 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200' 
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md'
          }`}
          onClick={() => setAdd(!add)}
        >
          <span className={`material-symbols-outlined transition-all duration-200 text-sm`}>
            {add ? 'close' : 'add'}
          </span>
          <span>
            {add ? 'Cancel' : 'Create'}
          </span>
        </button>

        {
          add &&
          (
            <div className='absolute top-full left-0 sm:left-auto sm:right-0 mt-2 shadow-lg bg-white text-black p-4 rounded-lg z-10 w-full sm:w-auto max-w-sm border border-gray-200'>
              <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-3 items-center'>
                <div className='w-full'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Organization Name</label>
                  <input 
                    {...register("orgName")}
                    ref={inputRef}
                    placeholder='Enter organization name'
                    className='w-full h-10 rounded-md p-3 border border-gray-300 text-black focus:border-blue-500 focus:outline-none transition-colors duration-200 text-sm'
                  />
                </div>
                <button 
                  type='submit' 
                  className='w-full bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                >
                  Create Organization
                </button>
              </form>
            </div>
          )
        }
      </div>

      <div className='w-full h-full overflow-y-scroll p-4 lg:p-10'>
        {orgs.length > 0 ?
          orgs.map((org, index) => {
            const isExpanded = expandedOrg === index;
            const isAddingMember = addingMemberToOrg === index;

            return (
              <div key={index} className='border-[#E6E9E8] border-b-2 transition-all duration-300 ease-in-out mb-2'>
                {/* Organization Header - Clickable */}
                <div
                  className='text-black h-16 sm:h-20 flex items-center justify-between pl-3 sm:pl-5 pr-3 sm:pr-5 cursor-pointer hover:bg-gray-50 transition-colors duration-200'
                  onClick={() => toggleOrgExpansion(index)}
                >
                  <p className='opacity-81 text-base sm:text-lg font-medium truncate pr-2'>{org.orgName}</p>

                  {/* Dropdown Arrow */}
                  <span
                    className={`material-symbols-outlined text-gray-600 transition-transform duration-300 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''
                      }`}
                  >
                    expand_more
                  </span>
                </div>

                {/* Organization Details - Expandable */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                >
                  <div className='px-3 sm:px-5 pb-6 pt-2 bg-gray-50'>
                    <div className='mb-4'>
                      <h4 className='text-black font-medium mb-2 text-sm sm:text-base'>Organization Details:</h4>
                      <p className='text-gray-700 text-xs sm:text-sm mb-1'>Name: {org.orgName}</p>
                    </div>

                    <div className='mb-4'>
                      <h4 className='text-black font-medium mb-2 text-sm sm:text-base'>Members:</h4>
                      {org.members && org.members.length > 0 ? (
                        <div className='flex flex-wrap gap-2 mb-3'>
                          {org.members.map((member, memberIndex) => (
                            <span
                              key={memberIndex}
                              className='inline-block bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm break-all'
                            >
                              {member.name || member.email || member}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className='text-gray-500 text-xs sm:text-sm italic mb-3'>No members added yet</p>
                      )}

                      {/* Action Buttons */}
                      <div className='flex flex-col sm:flex-row gap-3'>
                        {/* Add Member Button */}
                        {!isAddingMember ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startAddingMember(index);
                            }}
                            className='flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md text-xs sm:text-sm transition-colors duration-200 w-full sm:w-auto'
                          >
                            <span className="material-symbols-outlined text-sm">
                              person_add
                            </span>
                            Add Member
                          </button>
                        ) : (
                          <div className='bg-white p-3 rounded-md border border-gray-300 w-full'>
                            <form onSubmit={handleSubmitMember(onAddMember)} className='flex flex-col gap-3'>
                              <div>
                                <label className='block text-xs sm:text-sm font-medium text-gray-700 mb-1'>
                                  Member Email:
                                </label>
                                <input
                                  {...registerMember("memberEmail")}
                                  type="email"
                                  placeholder="Enter member's email"
                                  className='w-full h-9 rounded-md p-2 border border-gray-300 text-black text-xs sm:text-sm'
                                  onClick={(e) => e.stopPropagation()}
                                  required
                                />
                              </div>
                              <div className='flex gap-2'>
                                <button
                                  type='submit'
                                  className='bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs sm:text-sm transition-colors duration-200 flex-1'
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Add
                                </button>
                                <button
                                  type='button'
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    cancelAddingMember();
                                  }}
                                  className='bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs sm:text-sm transition-colors duration-200 flex-1'
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          </div>
                        )}

                        {/* Assign Tasks Button - Only show when not adding member and has members */}
                        {!isAddingMember && org.members && org.members.length > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openTaskAssignmentPopup(index);
                            }}
                            className='flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded-md text-xs sm:text-sm transition-colors duration-200 w-full sm:w-auto'
                          >
                            <span className="material-symbols-outlined text-sm">
                              assignment
                            </span>
                            Assign Tasks
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
          :
          <div className='text-black text-center py-8 text-sm sm:text-base'>No Organizations</div>
        }
      </div>

      {/* Task Assignment Popup */}
      {showTaskAssignmentPopup && selectedOrg && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-xl p-4 sm:p-6 w-full max-w-md sm:max-w-lg lg:max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl'>
            <h3 className='text-lg sm:text-xl font-bold mb-4 text-gray-800'>
              Assign Task - {selectedOrg.orgName}
            </h3>
            
            {/* Member Selection */}
            <div className='mb-4'>
              <label className='block text-xs sm:text-sm font-medium text-gray-700 mb-2'>
                Select Members to Assign Task:
              </label>
              <div className='max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-2'>
                {selectedOrg.members && selectedOrg.members.length > 0 ? (
                  selectedOrg.members.map((member, index) => {
                    const memberEmail = member.email || member;
                    const memberName = member.name || memberEmail;
                    const isSelected = selectedMembers.some(m => (m.email || m) === memberEmail);
                    
                    return (
                      <div
                        key={index}
                        onClick={() => toggleMemberSelection(member)}
                        className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors duration-200 ${
                          isSelected ? 'bg-blue-100 border-blue-300' : 'hover:bg-blue-100'
                        }`}
                      >
                        <span className='text-xs sm:text-sm text-black break-all pr-2'>{memberName+" ("+memberEmail+")"}</span>
                        {isSelected && (
                          <span 
                            className="material-symbols-outlined text-red-500 text-sm cursor-pointer hover:text-red-700 flex-shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleMemberSelection(member);
                            }}
                          >
                            close
                          </span>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className='text-gray-500 text-xs sm:text-sm italic'>No members available</p>
                )}
              </div>
            </div>

            {/* Selected Members Display */}
            {selectedMembers.length > 0 && (
              <div className='mb-4'>
                <label className='block text-xs sm:text-sm font-medium text-gray-700 mb-2'>
                  Selected Members:
                </label>
                <div className='flex flex-wrap gap-2'>
                  {selectedMembers.map((member, index) => (
                    <span
                      key={index}
                      className='inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm break-all'
                    >
                      <span className='truncate max-w-[120px] sm:max-w-none'>{member.name || member.email || member}</span>
                      <span
                        className="material-symbols-outlined text-red-500 text-sm cursor-pointer hover:text-red-700 flex-shrink-0"
                        onClick={() => toggleMemberSelection(member)}
                      >
                        close
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Task Title */}
            <div className='mb-4'>
              <label className='block text-xs sm:text-sm font-medium text-gray-700 mb-2'>
                Task Title
              </label>
              <input
                type="text"
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-xs sm:text-sm'
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="Enter task title..."
              />
            </div>

            {/* Task Description */}
            <div className='mb-6'>
              <label className='block text-xs sm:text-sm font-medium text-gray-700 mb-2'>
                Task Description
              </label>
              <textarea
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-xs sm:text-sm'
                rows="3"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                placeholder="Enter task description..."
              />
            </div>

            {/* Action Buttons */}
            <div className='flex flex-col sm:flex-row gap-3 justify-end'>
              <button
                type="button"
                className='px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200 text-xs sm:text-sm order-2 sm:order-1'
                onClick={closeTaskAssignmentPopup}
              >
                Cancel
              </button>
              <button
                type="button"
                className='px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200 disabled:opacity-50 text-xs sm:text-sm order-1 sm:order-2'
                onClick={handleTaskAssignment}
                disabled={!taskTitle.trim() || selectedMembers.length === 0}
              >
                Assign Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}