"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, {
  Draggable,
  DropArg,
} from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import bootstrapPlugin from "@fullcalendar/bootstrap";
import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";
import { EventSourceInput} from "@fullcalendar/core/index.js";
import {
  LiaDizzy,
  LiaFrown,
  LiaGrin,
  LiaGrinBeam,
  LiaGrinSquint,
} from "react-icons/lia";
import SelectBox from "../components/SelectBox";
import addMotivation from "../utils/AddMotivation";
import showMotivation from "../utils/showMotivation";
import deleteMotivation from "../utils/DeleteMotivation";
import "../globals.css";

interface Event {
  title: string;
  start: Date | string;
  allDay: boolean;
  id: number;
  // アイコンを追加
  icon: JSX.Element;
  backgroundColor: string;
}
interface OptionType {
  value: string;
  label: JSX.Element;
}

//SelectBoxコンポーネントの表示内容
const options = [
  {
    value: "happy",
    label: <LiaGrinSquint className="w-6 h-6" />,
  },
  {
    value: "good",
    label: <LiaGrinBeam className="w-6 h-6" />,
  },
  {
    value: "normal",
    label: <LiaGrin className="w-6 h-6" />,
  },
  {
    value: "better",
    label: <LiaFrown className="w-6 h-6" />,
  },
  {
    value: "bad",
    label: <LiaDizzy className="w-6 h-6" />,
  },
];

//表示用
const iconMap: {
  [key in "happy" | "good" | "normal" | "better" | "bad"]: JSX.Element;
} = {
  happy: <LiaGrinSquint size={24} />,
  good: <LiaGrinBeam size={24} />,
  normal: <LiaGrin size={24} />,
  better: <LiaFrown size={24} />,
  bad: <LiaDizzy size={24} />,
};

export default function RegisterPage() {
 
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);

  const [newEvent, setNewEvent] = useState<Event>({
    title: "",
    start: "",
    allDay: false,
    id: 0,
    icon: <></>,
    backgroundColor: "#ffffff",
  });
  //SelectBoxコンポーネントのselectedValue
  const [selectedValue, setSelectedValue] = useState<OptionType>(options[0]);

  useEffect(() => {
    const draggableEl = document.getElementById("draggable-el");
    if (draggableEl) {
      new Draggable(draggableEl, {
        itemSelector: ".fc-event",
        eventData: function (eventEl) {
          const title = eventEl.getAttribute("title");
          const id = eventEl.getAttribute("data");
          const start = eventEl.getAttribute("start");
          return { title, id, start };
        },
      });
    }
    //アイコン表示
    const getMotivation = async () => {
      const data = await showMotivation();

      // 例: dataは配列で、各要素が{value: "happy", ...}のような形であると仮定
      const eventWithIcons = data.map(
        (item: { value: string; display_date: string }, index: number) => ({
          id: index,
          title: item.value,
          start: item.display_date, // 開始日を選択した日付に設定
          allDay: true, // 終日イベントにする
          icon: iconMap[item.value as keyof typeof iconMap], // アイコンをマッピング
        })
      );
      console.log(eventWithIcons);
      setAllEvents((prevEvents) => [...prevEvents, ...eventWithIcons])
  
    };
    getMotivation();
  }, []);

  function handleDateClick(arg: { date: Date; allDay: boolean }) {
    setNewEvent({
      ...newEvent,
      start: arg.date,
      allDay: arg.allDay,
      id: new Date().getTime(),
    });

    setShowModal(true);
  }

  function addEvent(data: DropArg) {
    const event = {
      ...newEvent,
      
      start: newEvent.start,
      title: data.draggedEl.innerText,
      allDay: data.allDay,
      id: new Date().getTime(),
      icon: selectedValue.label, // ここでアイコンを関連付け
    };
    //要確認
    console.log(event);
    console.log(newEvent);
    setAllEvents([...allEvents, event]);

  }

 //イベント登録後にモーダル表示
  function handleCompleteModal() {

    setShowCompleteModal(true);
    setTimeout(() => {
      setShowCompleteModal(false);
    }, 2000);
  }


  function handleDeleteModal(data: { event: { id: string } }) {
    setShowDeleteModal(true);
    setIdToDelete(Number(data.event.id));
    //Supabaseから削除
    deleteMotivation(data.event.id);
  }

  function handleDelete() {
    setAllEvents(
      allEvents.filter((event) => Number(event.id) !== Number(idToDelete))
    );
    setShowDeleteModal(false);
    setIdToDelete(null);
  }

  function handleCloseModal() {
    setShowModal(false);
    setNewEvent({
      title: "",
      start: "",
      allDay: false,
      id: 0,
      icon: <></>,
      backgroundColor: "#ffffff",
    });
    setShowDeleteModal(false);
    setIdToDelete(null);
    setShowCompleteModal(false);
  }

  function handleSelectChange(value: OptionType | null) {
    if (value) {
      setSelectedValue(value);
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const value = selectedValue.value;

   
    if (value) {
      const selectedOption = options.find((option) => option.value === value);
      if (selectedOption) {
        setSelectedValue(selectedOption);
      }

      // 選択した日付を日本時間に変換
      const displayDate = new Date(newEvent.start).toLocaleString("ja-JP", {
        timeZone: "Asia/Tokyo",
      });
      console.log(displayDate);
      //allEvents.startがnullになってる
      console.log(allEvents);

      // 同じ日時は二回登録不可のバリデーション
      const hasTodayEvent = allEvents.some(
        (event) => new Date(event.start).toDateString() === new Date(newEvent.start).toDateString()
      );
      console.log(hasTodayEvent);

      if (hasTodayEvent) {
        alert("この日はすでにモチベーションが登録されています。");
        return;
      }else{
        addMotivation(value, displayDate);
      }

      
    }
    setShowModal(false);
    handleCompleteModal();

    console.log(selectedValue);
  }

  // カレンダーのレンダリング時にアイコンを表示
  const renderEventContent = (eventInfo: {
    event: { extendedProps: { icon: JSX.Element }; title: string };
  }) => {
    // extendedPropsからiconを取得し、表示内容を定義
    return (
      <div className="text-xs text-white bg-orange-300 rounded-full p-1">
        {eventInfo.event.extendedProps.icon}
      </div>
    );
  };

  return (
    <>
      <div className="p-6 bg-white-50 min-h-screen font-sans">
        <div className="bg-white-50 p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
          <h2 className="text-xl font-medium text-center mb-6">
            My Fitness Calendar
          </h2>

          <div className="flex justify-between items-center mb-6">
            <button className="text-gray-700 hover:text-gray-900">&lt;</button>
            <button className="text-gray-700 hover:text-gray-900">&gt;</button>
          </div>

          <div className="col-span-8 mb-6">
            <FullCalendar
              plugins={[
                dayGridPlugin,
                interactionPlugin,
                timeGridPlugin,
                bootstrapPlugin,
              ]}
              themeSystem="bootstrap5"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "resourceTimelineWook, dayGridMonth,timeGridWeek",
              }}
              events={allEvents as EventSourceInput}
              eventContent={renderEventContent}
              eventDisplay="block"
              nowIndicator={true}
              editable={true}
              droppable={true}
              selectable={true}
              selectMirror={true}
              dateClick={handleDateClick}
              // カレンダー上でイベント登録
              drop={(data) => addEvent(data)}
              eventClick={(data) => handleDeleteModal(data)}
              height="auto"
              initialView="dayGridMonth"
            />
          </div>
        </div>
      </div>

      <Transition.Root show={showDeleteModal} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setShowDeleteModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0  overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel
                  className="relative transform overflow-hidden rounded-lg
                   bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
                >
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div
                        className="mx-auto flex h-24 w-24 flex-shrink-0 items-center 
                        justify-center rounded-full bg-orange-100 sm:mx-0 sm:h-10 sm:w-10"
                      >
                        <ExclamationTriangleIcon
                          className=" h-30 w-30 text-orange-300"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-base font-semibold leading-6 text-gray-900"
                        >
                          削除
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            アイコンを削除します。よろしいですか？
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-orange-300 px-3 py-2 text-sm 
                      font-semibold text-white shadow-sm hover:bg-orange-200 sm:ml-3 sm:w-auto"
                      onClick={handleDelete}
                    >
                      削除
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 
                      shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={handleCloseModal}
                    >
                      キャンセル
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      <Transition.Root show={showModal} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setShowModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
                  <div className="overflow-y-auto max-h-[70vh]">
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900 mb-4"
                      >
                        今日のモチベーションは？
                      </Dialog.Title>
                      <form action="submit" onSubmit={handleSubmit}>
                        <div className="mt-2">
                          <SelectBox
                            options={options}
                            selectedValue={selectedValue}
                            onChange={handleSelectChange}
                          />
                        </div>

                        <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                          <button
                            type="submit"
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-emerald-400 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 sm:col-start-2 disabled:opacity-25"
                            disabled={selectedValue.value === ""}
                          
                          >
                            登録
                          </button>
                          <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                            onClick={handleCloseModal}
                          >
                            キャンセル
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>


      <Transition.Root show={showCompleteModal} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setShowCompleteModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>
      <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
                  <div className="overflow-y-auto max-h-[70vh]">
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900 mb-4"
                      >
                        登録完了！
                      </Dialog.Title>
                     
                    </div>
                    <div className="text-center mt-4 text-gray-500 text-sm " >素晴らしい一歩です！</div>
                    <button type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0" onClick={handleCloseModal}>閉じる</button>

                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
          </Dialog>
        </Transition.Root>  
        
    </>
  );
}
